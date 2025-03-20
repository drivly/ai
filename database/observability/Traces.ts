import type { CollectionConfig } from 'payload'

export const Traces: CollectionConfig = {
  slug: 'traces',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'name', type: 'text' }],
}
