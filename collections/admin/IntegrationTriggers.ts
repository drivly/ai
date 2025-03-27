import type { CollectionConfig } from 'payload'

export const IntegrationTriggers: CollectionConfig = {
  slug: 'integration-triggers',
  admin: {
    group: 'Admin',
    useAsTitle: 'display_name',
    hidden: true,
  },
  versions: true,
  fields: [
    { name: 'display_name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'payload', type: 'json' },
    { name: 'config', type: 'json' },
  ],
}
