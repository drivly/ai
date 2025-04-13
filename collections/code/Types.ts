import type { CollectionConfig } from 'payload'

export const Types: CollectionConfig = {
  slug: 'types',
  admin: {
    group: 'Code',
    useAsTitle: 'name',
    description: 'Defines TypeScript type definitions used throughout the system',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'hash', type: 'text' },
    { name: 'type', type: 'code', admin: { language: 'typescript', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'json', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'schema', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
  ],
}
