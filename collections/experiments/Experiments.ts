import type { CollectionConfig } from 'payload'

export const Experiments: CollectionConfig = {
  slug: 'experiments',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
    description: 'Feature flags and A/B testing experiments with real-world user feedback metrics',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique name for the experiment (used as the feature flag key)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of what this experiment is testing',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        description: 'Current status of the experiment',
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'vercel',
      options: [
        { label: 'Vercel', value: 'vercel' },
        { label: 'Internal', value: 'internal' },
      ],
      admin: {
        description: 'Feature flag provider to use for this experiment',
      },
    },
    {
      name: 'variants',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Different variations to test in this experiment',
      },
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this variant',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Description of this variant',
          },
        },
        {
          name: 'isControl',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this is the control/baseline variant',
          },
        },
        {
          name: 'config',
          type: 'json',
          required: true,
          admin: {
            description: 'Configuration values for this variant',
          },
        },
      ],
    },
    {
      name: 'metrics',
      type: 'array',
      admin: {
        description: 'Metrics to track for this experiment',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Name of the metric (e.g., click_through_rate, conversion_rate)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Description of what this metric measures',
          },
        },
        {
          name: 'higherIsBetter',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Whether higher values for this metric are better',
          },
        },
        {
          name: 'primary',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this is a primary metric for the experiment',
          },
        },
      ],
    },
    {
      name: 'trafficAllocation',
      type: 'group',
      admin: {
        description: 'How traffic is allocated between variants',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'percentage',
          options: [
            { label: 'Percentage', value: 'percentage' },
            { label: 'User', value: 'user' },
            { label: 'Session', value: 'session' },
          ],
          admin: {
            description: 'Type of traffic allocation',
          },
        },
        {
          name: 'values',
          type: 'json',
          required: true,
          admin: {
            description: 'Allocation values for each variant (e.g., {"control": 50, "variant-a": 25, "variant-b": 25})',
          },
        },
      ],
    },
    {
      name: 'targeting',
      type: 'json',
      admin: {
        description: 'Targeting rules for this experiment (optional)',
      },
    },
    {
      name: 'duration',
      type: 'group',
      admin: {
        description: 'Duration of the experiment',
      },
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            description: 'When the experiment starts',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'When the experiment ends',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'results',
      type: 'json',
      admin: {
        description: 'Aggregated results of the experiment (updated periodically)',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.variants && Array.isArray(data.variants)) {
          const hasControl = data.variants.some((variant) => variant.isControl)
          if (!hasControl && data.variants.length > 0) {
            data.variants[0].isControl = true
          }
        }
        return data
      },
    ],
  },
}
