import type { CollectionConfig } from 'payload'

export const EvalsRuns: CollectionConfig = {
  slug: 'evalRuns',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'testIds',
      type: 'array',
      fields: [
        {
          name: 'test',
          type: 'relationship',
          relationTo: 'evals',
          required: true,
        },
      ],
      admin: {
        description: 'References to evaluation tests included in this run',
      },
    },
    {
      name: 'results',
      type: 'array',
      fields: [
        {
          name: 'result',
          type: 'relationship',
          relationTo: 'evalResults',
        },
      ],
      admin: {
        description: 'References to evaluation results for this run',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        description: 'When the evaluation run started',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When the evaluation run completed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}
