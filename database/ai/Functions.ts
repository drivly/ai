import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'type', type: 'select', options: ['code', 'object', 'schema', 'markdown', 'list', 'array'] },
    { name: 'code', type: 'code', admin: { language: 'typescript' } },
  ],
}
