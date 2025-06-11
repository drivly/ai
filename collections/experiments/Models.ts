import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
    description: 'Defines AI models with their capabilities and pricing information',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'id', type: 'text', required: true },
    { name: 'provider', type: 'relationship', relationTo: 'providers', required: true },
    { name: 'lab', type: 'relationship', relationTo: 'labs' },
    { name: 'description', type: 'textarea' },
    { name: 'context_length', type: 'number' },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        { name: 'prompt', type: 'number' },
        { name: 'completion', type: 'number' },
      ],
    },
    { name: 'capabilities', type: 'array', fields: [{ name: 'capability', type: 'text' }] },
    { name: 'modelUrl', type: 'text' },
    { name: 'imageUrl', type: 'text' },
  ],
}
