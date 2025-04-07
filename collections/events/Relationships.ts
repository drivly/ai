import type { CollectionConfig } from 'payload'

export const Relationships: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Events',
    useAsTitle: 'verb',
  },
  versions: true,
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'resources' },
    { name: 'verb', type: 'relationship', relationTo: 'verbs' },
    { name: 'object', type: 'relationship', relationTo: 'resources' },
    { name: 'hash', type: 'text' },
    { name: 'generation', type: 'join', collection: 'generations', on: 'action' },
  ],
}
