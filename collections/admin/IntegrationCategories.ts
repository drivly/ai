import type { CollectionConfig } from 'payload'

export const IntegrationCategories: CollectionConfig = {
  slug: 'integration-categories',
  admin: {
    group: 'Admin',
    useAsTitle: 'category',
    hidden: true,
  },
  versions: true,
  fields: [{ name: 'category', type: 'text' }],
}
