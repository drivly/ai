import { createKey, findKey, getKey } from '@/lib/openrouter'
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
    { name: 'key', type: 'text' },
    { name: 'hash', type: 'text' },
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
          if (data.key) {
            const key = await findKey(data.key)
            if (key) data.hash = key.hash
          }
          if (!data.hash) {
            const { key, hash } = await createKey({ name: data.name, limit: 1 })
            data.key = key
            data.hash = hash
          }
        }
        return args
      },
    ],
  },
  endpoints: [
    {
      path: '/:id/credit',
      method: 'get',
      handler: async ({ routeParams = {}, payload }) => {
        const { id } = routeParams
        if (typeof id !== 'string' && typeof id !== 'number') {
          return Response.json({ error: 'API key ID is required' }, { status: 400 })
        }
        const apiKey = await payload.findByID({
          collection: 'apikeys',
          id,
        })
        if (!apiKey?.key) {
          return Response.json({ error: 'API key not found' }, { status: 404 })
        }
        const usage = await getKey(apiKey.key)
        return Response.json({ credit: usage.limit_remaining })
      },
    },
  ],
}
