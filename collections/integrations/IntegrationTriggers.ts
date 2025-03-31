import type { CollectionConfig } from 'payload'

export const IntegrationTriggers: CollectionConfig = {
  slug: 'integrationTriggers',
  labels: {
    singular: 'Trigger',
    plural: 'Triggers',
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
    { name: 'logo', type: 'text' },
    { name: 'payload', type: 'json' },
    { name: 'config', type: 'json' },
  ],
}
