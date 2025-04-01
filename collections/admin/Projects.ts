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
    { name: 'domains', type: 'join', collection: 'domains' as any, on: 'project' },
  ],
}
