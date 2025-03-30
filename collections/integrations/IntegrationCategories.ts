import type { CollectionConfig } from 'payload'

export const IntegrationCategories: CollectionConfig = {
  slug: 'integrationCategories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    group: 'Integrations',
    useAsTitle: 'category',
    hidden: false ,
  },
  versions: true,
  fields: [{ name: 'category', type: 'text' }],
}
