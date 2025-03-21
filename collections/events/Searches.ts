import type { CollectionConfig } from 'payload'

export const Searches: CollectionConfig = {
  slug: 'searches',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
