import type { CollectionConfig } from 'payload'
import { simplerJSON } from '../../src/utils/json-fields'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    group: 'Data',
    useAsTitle: 'yaml',
    description: 'Structured data resources with embeddings for semantic search',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'sqid', type: 'text', admin: { readOnly: true }, index: true },
        { name: 'hash', type: 'text', admin: { readOnly: true }, index: true },
        { name: 'type', type: 'relationship', relationTo: ['nouns', 'things'] },
      ],
    },
    ...simplerJSON({
      jsonFieldName: 'data',
      codeFieldName: 'yaml',
      label: 'Data',
      defaultFormat: 'yaml',
      editorOptions: { padding: { top: 20, bottom: 20 } },
    }),
    { name: 'embedding', type: 'json', admin: { hidden: true }, index: false },
    { name: 'subjectOf', type: 'join', collection: 'relationships', on: 'subject' },
    { name: 'objectOf', type: 'relationship', relationTo: 'relationships', hasMany: true },
    {
      name: 'content',
      type: 'code',
      admin: {
        language: 'mdx',
        editorOptions: { padding: { top: 20, bottom: 20 } },
      },
    },
  ],
}
