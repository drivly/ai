import type { CollectionConfig } from 'payload'

export const Relationships: CollectionConfig = {
  slug: 'relationships',
  admin: {
    group: 'Data',
    useAsTitle: 'verb',
    description: 'Defines semantic relationships between resources using subject-verb-object patterns',
  },
  versions: true,
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'resources' },
    { name: 'verb', type: 'relationship', relationTo: 'verbs' },
    { name: 'object', type: 'relationship', relationTo: 'resources' },
    { name: 'hash', type: 'text' },
  ],
}
