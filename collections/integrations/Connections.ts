import type { CollectionConfig } from 'payload'

export const Connections: CollectionConfig = {
  slug: 'integration-connections',
  admin: {
    group: 'Integrations',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { 
      name: 'name', 
      type: 'text',
      admin: {
        description: 'A name for this connection',
      },
    },
    { 
      name: 'user', 
      type: 'relationship', 
      relationTo: 'users',
      required: true,
    },
    { 
      name: 'integration', 
      type: 'relationship', 
      relationTo: 'integrations',
      required: true,
    },
    { 
      name: 'config', 
      type: 'json',
      admin: {
        description: 'Configuration for this connection',
      },
    },
    { 
      name: 'status', 
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
    },
  ],
}
