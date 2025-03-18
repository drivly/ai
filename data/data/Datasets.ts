import type { CollectionConfig } from 'payload'

export const Datasets: CollectionConfig = {
  slug: 'datasets',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
