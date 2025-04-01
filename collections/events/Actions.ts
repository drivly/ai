import type { CollectionConfig } from 'payload'

export const Actions: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'function', type: 'relationship', relationTo: 'functions' },
    { name: 'parameters', type: 'json' },
    { name: 'result', type: 'json' },
    { name: 'relationships', type: 'join', collection: 'actions', on: 'action' },
  ],
  access: {
    create: () => false,
  },
  hooks: {
  },
}
