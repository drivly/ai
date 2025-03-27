import type { CollectionConfig } from 'payload'

export const IntegrationCategories: CollectionConfig = {
  slug: 'integration-categories',
  admin: {
    group: 'Integrations',
    useAsTitle: 'category',
    hidden: false,
  },
  versions: true,
  fields: [{ name: 'category', type: 'text' }],
}
