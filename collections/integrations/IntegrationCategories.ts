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
    hidden: false,
    description: 'Organizes integrations into logical categories for easier discovery',
  },
  versions: true,
  fields: [{ name: 'category', type: 'text' }],
}
