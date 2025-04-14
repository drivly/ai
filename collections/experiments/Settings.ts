import type { CollectionConfig } from 'payload'

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
    description: 'Manages configuration settings for experiments and features',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'settings', type: 'json' },
  ],
}
