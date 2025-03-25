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
    { name: 'settings', type: 'relationship', relationTo: 'things' },
    { name: 'request', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'response', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'error', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'status', type: 'select', options: ['success', 'error'] },
    { name: 'duration', type: 'number' },

    // { name: 'function', type: 'relationship', relationTo: 'functions' },
    // { name: 'input', type: 'relationship', relationTo: 'resources' },
    // { name: 'output', type: 'relationship', relationTo: 'resources' },
  ],
}
