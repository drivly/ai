import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    group: 'Business',
    useAsTitle: 'title',
    description: 'Manages work items and assignments within the platform',
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
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Backlog', value: 'backlog' },
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Review', value: 'review' },
        { label: 'Done', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'queue',
      type: 'relationship',
      relationTo: 'queues',
      admin: { position: 'sidebar' },
    },
    {
      name: 'assigned',
      type: 'relationship',
      relationTo: ['users', 'roles', 'agents'],
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'tasks',
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'dependents',
      type: 'join',
      collection: 'tasks',
      on: 'dependentOn',
    },
    { name: 'metadata', type: 'json' },
    { name: 'linearMetadata', type: 'json' },
  ],
}
