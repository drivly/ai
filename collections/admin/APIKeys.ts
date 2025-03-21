import type { CollectionConfig } from 'payload'

export const APIKeys: CollectionConfig = {
  slug: 'apikeys',
  labels: { singular: 'API Key', plural: 'API Keys' },
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'url', type: 'text' },
  ],
}
