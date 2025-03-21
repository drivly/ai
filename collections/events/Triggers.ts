import type { CollectionConfig } from 'payload'

export const Triggers: CollectionConfig = {
  slug: 'triggers',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
