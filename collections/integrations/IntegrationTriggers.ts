import type { CollectionConfig } from 'payload'

export const IntegrationTriggers: CollectionConfig = {
  slug: 'integrationTriggers',
  labels: {
    singular: 'Trigger',
    plural: 'Triggers',
  },
  admin: {
    group: 'Integrations',
    useAsTitle: 'display_name',
    hidden: false,
  },
  versions: true,
  fields: [
    { name: 'display_name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'payload', type: 'json' },
    { name: 'config', type: 'json' },
  ],
}
