import type { CollectionConfig } from 'payload'

export const Deployments: CollectionConfig = {
  slug: 'deployments',
  admin: {
    group: 'Functions',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
