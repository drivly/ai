import type { CollectionConfig } from 'payload'

export const IntegrationTriggers: CollectionConfig = {
  slug: 'integration-triggers',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    hidden: true,
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
