// import murmurhash from 'murmurhash'
import type { CollectionConfig } from 'payload'
// import sqids from 'sqids'
import yaml from 'yaml'

export const Things: CollectionConfig = {
  slug: 'things',
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
        // { name: 'generatedBy', type: 'relationship', relationTo: 'functions', admin: { readOnly: true } },
      ],
    },
    // { name: 'content', type: 'code', admin: { language: 'mdx', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'yaml', type: 'code', admin: { language: 'yaml', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'data', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    // { name: 'generated', type:
    { name: 'subjectOf', type: 'join', collection: 'actions', on: 'subject' },
    { name: 'objectOf', type: 'join', collection: 'actions', on: 'object' },
  ],
  hooks: {
    beforeOperation: [
      async (args) => {
        if (args.operation === 'create') {
          // TODO: generate sqid and hash
          
        }

        if (args.operation === 'update') {
          // const { name, type } = args.data
          // const sqid = sqids.encode([name, type])
          // const hash = murmurhash([name, type])
          // return { sqid, hash }
        }
      },
    ],
    afterRead: [
      async (args) => {
        const { doc } = args
        doc.yaml = yaml.stringify(doc.data, { singleQuote: true })
        return doc
      },
    ],
  },
}
