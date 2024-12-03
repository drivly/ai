import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: { group: 'Manage', useAsTitle: 'name' },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'collection', type: 'relationship', relationTo: 'collections' },
    { name: 'data', type: 'json' },
  ],
}
