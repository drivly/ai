import type { CollectionConfig } from 'payload'

export const EvalsResults: CollectionConfig = {
  slug: 'eval-results',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
    hidden: true,
  },
  fields: [{ name: 'name', type: 'text' }],
}
