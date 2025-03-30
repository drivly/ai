import type { CollectionConfig } from 'payload'

export const EvalsRuns: CollectionConfig = {
  slug: 'evalRuns',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
  },
  fields: [{ name: 'name', type: 'text' }],
}
