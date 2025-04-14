import type { CollectionConfig } from 'payload'

export const ExperimentMetrics: CollectionConfig = {
  slug: 'experimentMetrics',
  admin: {
    group: 'Experiments',
    useAsTitle: 'id',
    description: 'Metrics collected from real-world user feedback for experiments',
  },
  fields: [
    {
      name: 'experimentId',
      type: 'relationship',
      relationTo: 'experiments',
      required: true,
      admin: {
        description: 'The experiment this metric is associated with',
      },
    },
    {
      name: 'variantId',
      type: 'text',
      required: true,
      admin: {
        description: 'The variant ID this metric is for',
      },
    },
    {
      name: 'userId',
      type: 'text',
      admin: {
        description: 'User ID associated with this metric (if available)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      admin: {
        description: 'Session ID associated with this metric (if available)',
      },
    },
    {
      name: 'metricName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the metric (e.g., click_through_rate, conversion_rate)',
      },
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      admin: {
        description: 'Numeric value of the metric',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      admin: {
        description: 'When this metric was recorded',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata for this metric (e.g., browser, device, page)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.timestamp) {
          data.timestamp = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
