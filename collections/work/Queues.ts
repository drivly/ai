import type { CollectionConfig } from 'payload'

export const Queues: CollectionConfig = {
  slug: 'queues',
  admin: {
    group: 'Work',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
    },
    {
      name: 'tasks',
      type: 'join',
      collection: 'tasks',
      on: 'queue',
    },
  ],
}
