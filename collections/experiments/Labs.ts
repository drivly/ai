import type { CollectionConfig } from 'payload'

export const Labs: CollectionConfig = {
  slug: 'labs',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'id', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'website', type: 'text' },
    { name: 'logoUrl', type: 'text' },
  ],
}
