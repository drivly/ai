import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'
import yaml from 'yaml'
import { on } from '../../pkgs/payload-hooks-queue/src'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    group: 'Data',
    useAsTitle: 'yaml',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'sqid', type: 'text', admin: { readOnly: true }, index: true },
        { name: 'hash', type: 'text', admin: { readOnly: true }, index: true },
        { name: 'type', type: 'relationship', relationTo: 'nouns' },
      ],
    },
    { name: 'yaml', type: 'code', admin: { language: 'yaml', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'data', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'embedding', type: 'json', admin: { hidden: true }, index: false },
    { name: 'subjectOf', type: 'relationship', relationTo: 'actions', hasMany: true },
    { name: 'objectOf', type: 'relationship', relationTo: 'actions', hasMany: true },
  ],
  hooks: {
    beforeOperation: [
      async (args) => {
        if (args.operation === 'create') {
        }

        if (args.operation === 'update') {
        }
      },
    ],
    ...on('afterChange', {
      slug: 'generateThingEmbedding',
      input: {
        id: 'doc.id'
      }
    }),
    afterRead: [
      async (args) => {
        const { doc } = args
        doc.yaml = yaml.stringify(doc.data, { singleQuote: true, lineWidth: 0 })
        return doc
      },
    ],
  },
}
