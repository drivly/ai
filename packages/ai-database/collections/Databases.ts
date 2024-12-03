import type { CollectionConfig } from 'payload'

export const Databases: CollectionConfig = {
  slug: 'databases',
  admin: { useAsTitle: 'name' },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'data', type: 'json' },
    { name: 'collections', type: 'join', collection: 'collections', on: 'database' },
  ],
}
