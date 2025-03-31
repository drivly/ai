import type { CollectionConfig } from 'payload'

export const IntegrationActions: CollectionConfig = {
  slug: 'integrationActions',
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
    { name: 'appKey', type: 'text' },
    { name: 'appName', type: 'text' },
    { name: 'appId', type: 'text' },
    { name: 'version', type: 'text' },
    { name: 'parameters', type: 'json' },
    { name: 'response', type: 'json' },
  ],
}
