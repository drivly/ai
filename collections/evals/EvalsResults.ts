import type { CollectionConfig } from 'payload'

export const EvalsResults: CollectionConfig = {
  slug: 'eval-results',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
  },
  fields: [{ name: 'name', type: 'text' }],
}
