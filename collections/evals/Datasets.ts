import type { CollectionConfig } from 'payload'

export const Datasets: CollectionConfig = {
  slug: 'datasets',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
    description: 'Manages datasets used for training and evaluating AI models',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
