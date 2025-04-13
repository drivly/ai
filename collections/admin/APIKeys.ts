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
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'description', type: 'text' },
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
        }
      ]
    },
  ],
}
