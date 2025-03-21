import type { CollectionConfig } from 'payload'

export const Schemas: CollectionConfig = {
  slug: 'schemas',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'type', type: 'code', admin: { language: 'typescript' } },
    { name: 'json', type: 'json' },
  ],
}
