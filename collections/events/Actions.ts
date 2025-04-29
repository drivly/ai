import type { CollectionConfig } from 'payload'

export const Actions: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
    description: 'Records of actions performed within the system',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'functionId', type: 'relationship', relationTo: 'functions' },
    { name: 'verbId', type: 'relationship', relationTo: 'verbs' },
    { name: 'parameters', type: 'json' },
    { name: 'result', type: 'json' },
    // { name: 'relationships', type: 'join' , collection: 'relationships', on: 'action' },
  ],
  access: {
    create: () => false,
  },
  hooks: {},
}
