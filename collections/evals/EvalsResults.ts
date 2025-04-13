import type { CollectionConfig } from 'payload'

export const EvalsResults: CollectionConfig = {
  slug: 'evalResults',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
    hidden: true,
    description: 'Stores detailed results from evaluation test runs',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'testId',
      type: 'relationship',
      relationTo: 'evals',
      required: true,
      admin: {
        description: 'Reference to the evaluation test this result is for',
      },
    },
    {
      name: 'output',
      type: 'json',
      admin: {
        description: 'Output data from running the test',
      },
    },
    {
      name: 'score',
      type: 'number',
      admin: {
        description: 'Overall score for this evaluation result (0-1)',
      },
    },
    {
      name: 'metrics',
      type: 'json',
      admin: {
        description: 'Detailed metrics for this evaluation result',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Duration of the test execution in milliseconds',
      },
    },
    {
      name: 'error',
      type: 'text',
      admin: {
        description: 'Error message if the test execution failed',
      },
    },
  ],
  timestamps: true,
}
