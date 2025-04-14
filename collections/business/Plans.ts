import type { CollectionConfig } from 'payload'

export const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    group: 'Business',
    useAsTitle: 'name',
    description: 'Strategic plans with actionable steps to achieve goals',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'status', type: 'select', options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Active', value: 'active' },
      { label: 'Completed', value: 'completed' },
      { label: 'Archived', value: 'archived' }
    ]},
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'owner', type: 'relationship', relationTo: 'users' },
    { name: 'goals', type: 'relationship', relationTo: 'goals', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'priority', type: 'select', options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' }
    ]},
    { 
      name: 'steps', 
      type: 'array', 
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'order', type: 'number' },
        { name: 'duration', type: 'number' },
        { name: 'assignee', type: 'relationship', relationTo: 'users' },
        { name: 'status', type: 'select', options: [
          { label: 'Not Started', value: 'not_started' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Completed', value: 'completed' },
          { label: 'Blocked', value: 'blocked' }
        ]}
      ]
    }
  ]
}
