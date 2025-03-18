import type { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    group: 'Workflows',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
