import type { CollectionConfig } from 'payload'

export const Experiments: CollectionConfig = {
  slug: 'experiments',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
  },
  fields: [{ name: 'name', type: 'text' }],
}
