import type { CollectionConfig, CollectionSlug } from 'payload'

export const Functions: CollectionConfig<CollectionSlug> = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  // versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        // { name: 'type', type: 'select', options: ['code (T => T)', 'object (Record<string, any>)', 'schema (T)', 'markdown (string)', 'list (string[])', 'array (T[])'] },
        { name: 'type', type: 'select', options: ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code'], defaultValue: 'Object' },
        // { name: 'noun', type: 'relationship', relationTo: 'nouns' },
        // { name: 'verb', type: 'relationship', relationTo: 'verbs' },
      ],
    },
    { name: 'schema', type: 'json', admin: { condition: (data) => ['Object', 'ObjectArray'].includes(data?.type), editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'code', type: 'code', admin: { language: 'typescript', condition: (data) => data?.type === 'Code', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    // { name: 'schema', type: 'code', admin: { language: 'yaml', condition: (data) => data?.type === 'Object', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    // { name: 'schema', type: 'relationship', relationTo: 'schemas', admin: { condition: (data) => ['Object', 'ObjectArray'].includes(data?.type) } },

    { name: 'prompt', type: 'relationship', relationTo: 'prompts', admin: { condition: (data) => data?.type !== 'Code' } }
  ],
}
