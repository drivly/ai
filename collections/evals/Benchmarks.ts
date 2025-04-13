import type { CollectionConfig } from 'payload'

export const Benchmarks: CollectionConfig = {
  slug: 'benchmarks',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
    description: 'Tracks performance benchmarks for AI functions and models',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'name', type: 'text' }],
}
