import type { CollectionConfig } from 'payload'

export const KPIs: CollectionConfig = {
  slug: 'kpis',
  admin: {
    group: 'Work',
    useAsTitle: 'name',
  },
  labels: { singular: 'KPI', plural: 'KPIs' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'goals',
      type: 'join',
      collection: 'goals',
      on: 'keyResults.kpiRelationship',
    },
  ],
}
