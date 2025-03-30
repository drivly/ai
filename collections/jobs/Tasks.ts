import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    group: 'Jobs',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'queue',
          type: 'relationship',
          relationTo: 'queues',
        },
        {
          name: 'parent',
          type: 'relationship',
          relationTo: 'tasks',
        },
      ],
    },
    {
      name: 'subtasks',
      type: 'join',
      collection: 'tasks',
      on: 'parent',
    },
    {
      name: 'dependentOn',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: true,
    },
    {
      name: 'dependents',
      type: 'join',
      collection: 'tasks',
      on: 'dependentOn',
    },
    {
      name: 'assigned',
      type: 'relationship',
      relationTo: ['users', 'roles'],
      hasMany: true,
    },
  ],
}
