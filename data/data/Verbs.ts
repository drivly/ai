import type { CollectionConfig } from 'payload'

export const Verbs: CollectionConfig = {
  slug: 'verbs',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
