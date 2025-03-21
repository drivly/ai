import type { CollectionConfig } from 'payload'

export const Generations: CollectionConfig = {
  slug: 'generations',
  admin: {
    group: 'Observability',
    useAsTitle: 'action',
  },
  access: { update: () => false, delete: () => false },
  fields: [
    { name: 'action', type: 'relationship', relationTo: 'actions' },
    { name: 'settings', type: 'relationship', relationTo: 'resources' },
    { name: 'request', type: 'json' },
    { name: 'response', type: 'json' },
    { name: 'error', type: 'json' },
    { name: 'status', type: 'select', options: ['success', 'error'] },
    { name: 'duration', type: 'number' },
    
    // { name: 'function', type: 'relationship', relationTo: 'functions' },
    // { name: 'input', type: 'relationship', relationTo: 'resources' },
    // { name: 'output', type: 'relationship', relationTo: 'resources' },
  ],
}