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
    { name: 'type', type: 'select', options: ['code (T => T)', 'object (Record<string, any>)', 'schema (T)', 'markdown (string)', 'list (string[])', 'array (T[])'] },
    { name: 'code', type: 'code', admin: { language: 'typescript', editorOptions: { padding: { top: 20, bottom: 20 }} } },
    { name: 'input', type: 'relationship', relationTo: 'nouns' },
    { name: 'output', type: 'relationship', relationTo: 'nouns' },
    { name: 'inputSchema', type: 'relationship', relationTo: 'schemas' },
    { name: 'outputSchema', type: 'relationship', relationTo: 'schemas' },
  ],
}
