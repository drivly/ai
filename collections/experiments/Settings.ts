import type { CollectionConfig } from 'payload'

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'settings', type: 'json' },
  ],
}
