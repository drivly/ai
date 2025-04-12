import type { CollectionConfig } from 'payload'

export const Integrations: CollectionConfig = {
  slug: 'integrations',
  labels: {
    singular: 'Integration',
    plural: 'Integrations',
  },
  admin: {
    group: 'Integrations',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'id', type: 'text' },
    { name: 'name', type: 'text' },
    { name: 'provider', type: 'select', options: ['composio', 'linear'], defaultValue: 'composio' },
  ],
}
