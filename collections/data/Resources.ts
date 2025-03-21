import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'content', type: 'code', admin: { language: 'mdx', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'data', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
  ],
}
