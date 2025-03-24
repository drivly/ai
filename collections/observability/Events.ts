import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'action', type: 'relationship', relationTo: 'actions' },
    { name: 'generation', type: 'relationship', relationTo: 'generations' },
    { name: 'request', type: 'json' },
    { name: 'data', type: 'json' },
    { name: 'meta', type: 'json' },
  ],
}
