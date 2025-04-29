import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Projects',
    useAsTitle: 'name',
    description: 'Manages projects and their associated domains',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'domain', type: 'text' },
    { name: 'domains', type: 'relationship', relationTo: 'domains' as any, hasMany: true },
    {
      name: 'goals',
      type: 'relationship',
      relationTo: 'goals',
      hasMany: true,
      admin: {
        description: 'Goals associated with this project',
      },
    },
  ],
}
