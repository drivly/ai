import type { CollectionConfig } from 'payload'

export const IntegrationCategories: CollectionConfig = {
  slug: 'integration-categories',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    hidden: true,
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
