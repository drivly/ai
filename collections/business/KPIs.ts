import type { CollectionConfig } from 'payload'

export const KPIs: CollectionConfig = {
  slug: 'kpis',
  admin: {
    group: 'Business',
    useAsTitle: 'name',
    description: 'Manages key performance indicators for tracking business metrics',
  },
  labels: { singular: 'KPI', plural: 'KPIs' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'number',
      admin: {
        description: 'Current value of the KPI',
      },
    },
    {
      name: 'target',
      type: 'number',
      admin: {
        description: 'Target value of the KPI',
      },
    },
    {
      name: 'unit',
      type: 'text',
      admin: {
        description: 'Unit of measurement (e.g., $, %, users)',
      },
    },
    {
      name: 'format',
      type: 'select',
      options: [
        { label: 'Number', value: 'number' },
        { label: 'Currency', value: 'currency' },
        { label: 'Percentage', value: 'percentage' },
      ],
      defaultValue: 'number',
      admin: {
        description: 'Format for displaying the KPI value',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of what this KPI measures',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'The project or tenant this KPI belongs to',
      },
    },
    {
      name: 'goals',
      type: 'join',
      collection: 'goals',
      on: 'keyResults.kpiRelationship',
    },
  ],
}
