import type { CollectionConfig } from 'payload'

export const Nouns: CollectionConfig = {
  slug: 'nouns',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
