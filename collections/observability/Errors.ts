import type { CollectionConfig } from 'payload'

export const Errors: CollectionConfig = {
  slug: 'errors',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'name', type: 'text' }],
}
