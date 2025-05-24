import { getApiKey } from '@/app/(apis)/api/chat/route'
import { createKey, getKey } from '@/lib/openrouter'
import type { CollectionConfig } from 'payload'

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
