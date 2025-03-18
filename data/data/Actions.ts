import type { CollectionConfig } from 'payload'

export const Actions: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
