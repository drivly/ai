import type { CollectionConfig } from 'payload'

export const Deployments: CollectionConfig = {
  slug: 'deployments',
  admin: {
    group: 'Code',
    useAsTitle: 'name',
    description: 'Manages deployments of code to production environments',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
