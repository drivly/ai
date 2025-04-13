import type { CollectionConfig } from 'payload'

export const Goals: CollectionConfig = {
  slug: 'goals',
  admin: {
    group: 'Work',
    useAsTitle: 'title',
    description: 'Manages objectives and key results for tracking progress',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'object',
      type: 'text',
      required: true,
      admin: {
        description: 'The objective of this goal',
      },
    },
    {
      name: 'keyResults',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'kpiRelationship',
          type: 'relationship',
          relationTo: 'kpis',
        },
      ],
    },
  ],
}
