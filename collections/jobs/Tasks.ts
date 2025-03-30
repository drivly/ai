import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    group: 'Jobs',
    useAsTitle: 'title',
  },
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'tasks',
    },
    {
      name: 'subtasks',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: true,
    },
    {
      name: 'dependentOn',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: true,
    },
    {
      name: 'dependents',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: true,
    },
    {
      name: 'assigned',
      type: 'relationship',
      relationTo: ['users', 'roles'],
      hasMany: true,
    },
  ],
}
