import type { CollectionConfig } from 'payload'

export const Queues: CollectionConfig = {
  slug: 'queues',
  admin: {
    group: 'Business',
    useAsTitle: 'name',
    description: 'Manages work queues for task assignment and processing',
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
