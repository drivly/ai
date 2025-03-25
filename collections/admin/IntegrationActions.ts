import type { CollectionConfig } from 'payload'

export const IntegrationActions: CollectionConfig = {
  slug: 'integration-actions',
  admin: {
    group: 'Admin',
    useAsTitle: 'displayName',
    hidden: true,
  },
  versions: true,
  fields: [
    { name: 'displayName', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'parameters', type: 'json' },
    { name: 'response', type: 'json' },
  ],
}
