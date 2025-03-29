import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Observability',
    useAsTitle: 'type',
    description: 'Records of all significant occurrences within the platform',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'timestamp', type: 'date', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'source', type: 'text', required: true },
    { name: 'subject', type: 'relationship', relationTo: 'things' },
    { name: 'data', type: 'json', required: true },
    { name: 'metadata', type: 'json' },

    { name: 'action', type: 'relationship', relationTo: 'actions' },
    { name: 'trigger', type: 'relationship', relationTo: 'triggers' },
    { name: 'search', type: 'relationship', relationTo: 'searches' },
    { name: 'function', type: 'relationship', relationTo: 'functions' },
    { name: 'workflow', type: 'relationship', relationTo: 'workflows' },
    { name: 'agent', type: 'relationship', relationTo: 'agents' },

    { name: 'generations', type: 'relationship', relationTo: 'generations', hasMany: true },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.timestamp) {
          data.timestamp = new Date()
        }
        return data
      },
    ],
  },
}
