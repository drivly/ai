import type { CollectionConfig } from 'payload'

export const Deployments: CollectionConfig = {
  slug: 'deployments',
  admin: {
    group: 'Code',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
