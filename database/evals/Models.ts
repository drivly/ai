import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'name', type: 'text' }],
}
