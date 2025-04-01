import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'domain', type: 'text' },
    { name: 'domains', type: 'relationship', relationTo: 'domains' as any, hasMany: true },
  ],
}
