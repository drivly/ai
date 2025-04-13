import type { CollectionConfig } from 'payload'

export const Searches: CollectionConfig = {
  slug: 'searches',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
    description: 'Records and manages search queries and their results',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'query', type: 'text' },
    {
      name: 'searchType',
      type: 'select',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Vector', value: 'vector' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      defaultValue: 'text',
    },
    { name: 'results', type: 'json', admin: { readOnly: true } },
    { name: 'embedding', type: 'json', admin: { hidden: true } },
  ],
}
