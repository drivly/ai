import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text' },
      // { name: 'generatedBy', type: 'relationship', relationTo: 'functions', admin: { readOnly: true } },
    ]},
    // { name: 'content', type: 'code', admin: { language: 'mdx', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'data', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    // { name: 'generated', type: 
    { name: 'subjectOf', type: 'join', collection: 'actions', on: 'subject'  },
    { name: 'objectOf', type: 'join', collection: 'actions', on: 'object'  },
  ],
}
