import type { CollectionConfig } from 'payload'

export const Triggers: CollectionConfig = {
  slug: 'triggers',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
    description: 'Defines event triggers that can initiate workflows and actions',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'payload', type: 'json' },
    { name: 'config', type: 'json' },
  ],
}
