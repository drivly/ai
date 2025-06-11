import { sendSlackAlert } from '@/lib/auth/actions/slack.action'
import { createKey, getKey } from '@/lib/openrouter'
import { nanoid } from 'nanoid'
import type { CollectionConfig, Payload } from 'payload'

export const APIKeys: CollectionConfig = {
  slug: 'apikeys',
  labels: { singular: 'API Key', plural: 'API Keys' },
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    description: 'Manages API keys for authentication and access control',
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['api', 'llm'], defaultValue: 'api', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'organization', type: 'relationship', relationTo: 'organizations' },
    { name: 'email', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'hash', type: 'text' },
    { name: 'label', type: 'text' },
    { name: 'url', type: 'text' },
    {
      name: 'cfWorkerDomains',
      type: 'array',
      label: 'Cloudflare Worker Domains',
      admin: {
        description: 'Domains of authorized Cloudflare Workers',
      },
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ operation, args }) => {
        const data = args.data
        if (operation === 'create' && data && !data.apiKey) {
          if (data.type === 'api') {
            data.apiKey = `key_${nanoid(32)}`
          } else if (data.type === 'llm') {
            const key = await createKey({ name: data.email, limit: 1 })
            data.apiKey = key.key
            data.hash = key.hash
            data.label = key.label
          }
          data.enableAPIKey = true
        }
        return args
      },
    ],
    afterOperation: [
      async ({ operation, args }) => {
        if (operation === 'create' && args.data.type === 'llm') {
          await sendSlackAlert('signups', {
            Name: args.data.name,
            Email: args.data.email,
          })
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/credit',
      method: 'get',
      handler: async ({ headers, payload }) => {
        const apiKey = await getLLMApiKey(headers, payload)
        if (apiKey instanceof Response) {
          return apiKey
        } else if (!apiKey) {
          return Response.json({ error: 'API key not found' }, { status: 404 })
        }
        const usage = await getKey(apiKey)
        return Response.json({ credit: usage.limit_remaining })
      },
    },
  ],
}

export async function getLLMApiKey(headers: Headers, payload: Payload) {
  // Get auth info - require either header API key or NextAuth session
  const headerApiKey = headers.get('Authorization')?.split(' ').pop()

  if (!headerApiKey) {
    console.log('❌ APIKeys: Unauthorized - No valid authentication source')
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // Initialize API key - check header first, then NextAuth user's apiKey
  let apiKey: string | null = null
  if (headerApiKey?.startsWith('sk-')) {
    apiKey = headerApiKey
  } else {
    // If we still don't have an API key, check Payload auth
    if (headerApiKey.startsWith('key_')) {
      headers.set('Authorization', 'apikeys API-Key ' + headerApiKey)
    } else {
      headers.set('Authorization', 'users API-Key ' + headerApiKey)
    }
    // Get user from payload auth
    const authResult = await payload.auth({ headers })
    const user = authResult.user

    // If authenticated payload user has an API key, use it
    if (user?.collection === 'apikeys' && user.apiKey && user.type === 'llm') {
      apiKey = user.apiKey
    }
    // If authenticated user exists but no API key, get or create one
    else if (user) {
      try {
        const existingResult = await payload.find({
          collection: 'apikeys',
          where: {
            type: { equals: 'llm' },
            or: [
              { email: { equals: user.email } },
              { user: { equals: (user?.collection === 'apikeys' && user.user && (typeof user.user === 'string' ? user.user : user.user.id)) || user.id } },
            ],
          },
          select: { apiKey: true },
          limit: 1,
        })

        if (existingResult.docs[0]?.apiKey) apiKey = existingResult.docs[0].apiKey
        else {
          const result = await payload.create({
            collection: 'apikeys',
            data: {
              email: user.email,
              name: user.name,
              user: user.id,
              type: 'llm',
            },
          })
          apiKey = result.apiKey || null
        }
      } catch (error) {
        console.error('❌ Chat API: Error getting/creating API key:', error)
      }
    }
  }

  // At this point, apiKey should contain our best API key or null if none found
  return apiKey
}
