import type { CollectionConfig } from 'payload'

export const Benchmarks: CollectionConfig = {
  slug: 'benchmarks',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'name', type: 'text' }],
}
