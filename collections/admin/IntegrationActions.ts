import type { CollectionConfig } from 'payload'

export const IntegrationActions: CollectionConfig = {
  slug: 'integration-actions',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    hidden: true,
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
