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
      relationTo: 'tasks' as any,
    },
    {
      name: 'subtasks',
      type: 'relationship',
      relationTo: 'tasks' as any,
      hasMany: true,
    },
    {
      name: 'dependentOn',
      type: 'relationship',
      relationTo: 'tasks' as any,
      hasMany: true,
    },
    {
      name: 'dependents',
      type: 'relationship',
      relationTo: 'tasks' as any,
      hasMany: true,
    },
    {
      name: 'assigned',
      type: 'relationship',
      relationTo: ['users', 'roles'] as any,
      hasMany: true,
    },
  ],
}
