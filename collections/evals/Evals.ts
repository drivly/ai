import type { CollectionConfig } from 'payload'

export const Evals: CollectionConfig = {
  slug: 'evals',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
    description: 'Defines evaluation tests for measuring AI function performance',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'input',
      type: 'json',
      admin: {
        description: 'Input data for the evaluation test',
      },
    },
    {
      name: 'expected',
      type: 'json',
      admin: {
        description: 'Expected output data for comparison',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Tags for categorizing and filtering tests',
      },
    },
  ],
  timestamps: true,
}
