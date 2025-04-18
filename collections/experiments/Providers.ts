import type { CollectionConfig } from 'payload'

export const Providers: CollectionConfig = {
  slug: 'providers',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
    description: 'Defines AI service providers and their connection details',
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
