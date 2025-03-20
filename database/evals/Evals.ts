import type { CollectionConfig } from 'payload'

export const Evals: CollectionConfig = {
  slug: 'evals',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
  },
  fields: [{ name: 'name', type: 'text' }],
}
