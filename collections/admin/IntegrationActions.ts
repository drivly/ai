import type { CollectionConfig } from 'payload'

export const IntegrationActions: CollectionConfig = {
  slug: 'integration-actions',
  labels: {
    singular: 'Action',
    plural: 'Actions',
  },
  admin: {
    group: 'Integrations',
    useAsTitle: 'displayName',
    hidden: false,
  },
  versions: true,
  fields: [
    { name: 'displayName', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'parameters', type: 'json' },
    { name: 'response', type: 'json' },
  ],
}
