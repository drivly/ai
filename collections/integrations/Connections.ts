import type { CollectionConfig } from 'payload'

export const Connections: CollectionConfig = {
  slug: 'connections',
  admin: {
    group: 'Integrations',
    useAsTitle: 'name',
    description: 'Manages connections to external services and APIs',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'integration', type: 'relationship', relationTo: 'integrations', required: true },
    { name: 'status', type: 'select', options: ['active', 'inactive', 'pending'], defaultValue: 'active' },
    { name: 'metadata', type: 'json' },
  ],
}
