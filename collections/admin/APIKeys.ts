import { getOrCreateUserApikey } from '@/lib/actions/user.action'
import { serverAuth } from '@/hooks/server-auth'
import { createKey, getKey } from '@/lib/openrouter'
import type { CollectionConfig, Payload } from 'payload'
import { sendSlackAlert } from '@/lib/auth/actions/slack.action'

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
        if (operation === 'create') {
          const key = await createKey({ name: data.name, limit: 1 })
          data.apiKey = key.key
          data.hash = key.hash
          data.label = key.label
          data.enableAPIKey = true
        }
        return args
      },
    ],
    afterOperation: [
      async ({ operation, args }) => {
        if (operation === 'create') {
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
        const apiKey = await getApiKey(headers, payload)
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

export async function getApiKey(headers: Headers, payload: Payload) {
  // Get auth info - require either header API key or NextAuth session
  const headerApiKey = headers.get('Authorization')?.split(' ')[1]

  if (!headerApiKey) {
    console.log('❌ APIKeys: Unauthorized - No valid authentication source')
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // Initialize API key - check header first, then NextAuth user's apiKey
  let apiKey: string | null = null
  if (headerApiKey?.startsWith('sk-')) {
    apiKey = headerApiKey
  }

  // If we still don't have an API key, check Payload auth
  if (!apiKey) {
    // Get user from payload auth
    const authResult = await payload.auth({ headers })
    const user = authResult.user

    // If authenticated payload user has an API key, use it
    if (user?.collection === 'apikeys' && user.apiKey) {
      apiKey = user.apiKey
    }
    // If authenticated user exists but no API key, get or create one
    else if (user) {
      try {
        const result = await getOrCreateUserApikey({
          id: user.id,
          email: user.email || '',
          name: user.name || user.email || 'API Key',
        })

        if (result) {
          apiKey = result
        }
      } catch (error) {
        console.error('❌ Chat API: Error getting/creating API key:', error)
      }
    }
  }

  // At this point, apiKey should contain our best API key or null if none found
  return apiKey
}
