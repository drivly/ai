import type { CollectionConfig } from 'payload'

export const Types: CollectionConfig = {
  slug: 'types',
  admin: {
    group: 'Code',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'hash', type: 'text' },
    { name: 'type', type: 'code', admin: { language: 'typescript' } },
    { name: 'json', type: 'json' },
    { name: 'schema', type: 'json' },
  ],
}
