import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  admin: { useAsTitle: 'name' },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'database', type: 'relationship', relationTo: 'databases' },
    { name: 'resources', type: 'join', collection: 'resources', on: 'collection' },
  ],
}
