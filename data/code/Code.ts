import type { CollectionConfig } from 'payload'

export const Code: CollectionConfig = {
  slug: 'code',
  admin: {
    group: 'Functions',
    useAsTitle: 'name',
  },
  labels: { plural: 'Code', singular: 'Code' },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
