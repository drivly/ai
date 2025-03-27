import type { CollectionConfig } from 'payload'

export const Integrations: CollectionConfig = {
  slug: 'integrations',
  admin: {
    group: 'Integrations',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'id', type: 'text' },
    { name: 'name', type: 'text' },
  ],
}
