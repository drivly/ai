import type { CollectionConfig } from 'payload'

export const KPIs: CollectionConfig = {
  slug: 'kpis',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
  },
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
