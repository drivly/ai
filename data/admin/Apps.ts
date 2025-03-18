import type { CollectionConfig } from 'payload'

export const Apps: CollectionConfig = {
  slug: 'apps',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  auth: { useAPIKey: true },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'url', type: 'text' },
  ],
}
