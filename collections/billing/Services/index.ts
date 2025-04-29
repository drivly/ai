import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Billing',
    useAsTitle: 'name',
    description: 'Services-as-Software with billing capabilities',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Degraded', value: 'degraded' },
          ],
          defaultValue: 'active',
          required: true,
        },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'endpoint', type: 'text', required: true },
    { name: 'version', type: 'text' },
    {
      name: 'objective',
      type: 'group',
      admin: {
        description: 'Business objective this service aims to achieve',
      },
      fields: [
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'keyResults',
      type: 'array',
      admin: {
        description: 'Key results for measuring service success',
      },
      fields: [
        { name: 'description', type: 'textarea', required: true },
        { name: 'target', type: 'number' },
        { name: 'currentValue', type: 'number' },
        { name: 'unit', type: 'text' },
        { name: 'dueDate', type: 'date' },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        description: 'Service pricing configuration',
      },
      fields: [
        {
          name: 'model',
          type: 'select',
          options: [
            { label: 'Cost-based', value: 'cost-based' },
            { label: 'Margin-based', value: 'margin-based' },
            { label: 'Activity-based', value: 'activity-based' },
            { label: 'Outcome-based', value: 'outcome-based' },
          ],
          required: true,
          admin: {
            description: 'Pricing model for this service',
          },
        },
        {
          name: 'costBase',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => ['cost-based', 'margin-based'].includes(siblingData?.model),
            description: 'Base cost in USD',
          },
        },
        {
          name: 'fixedCosts',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => siblingData?.model === 'cost-based',
            description: 'Fixed costs in USD',
          },
        },
        {
          name: 'variableCosts',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => siblingData?.model === 'cost-based',
            description: 'Variable costs in USD',
          },
        },
        {
          name: 'marginPercentage',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            condition: (data, siblingData) => siblingData?.model === 'margin-based',
            description: 'Margin percentage (0-100)',
          },
        },
        {
          name: 'activities',
          type: 'array',
          admin: {
            condition: (data, siblingData) => siblingData?.model === 'activity-based',
            description: 'Billable activities with rates',
          },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'rate', type: 'number', required: true, min: 0 },
          ],
        },
        {
          name: 'outcomes',
          type: 'array',
          admin: {
            condition: (data, siblingData) => siblingData?.model === 'outcome-based',
            description: 'Billable outcomes with targets and prices',
          },
          fields: [
            { name: 'metric', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'targetValue', type: 'number', required: true },
            { name: 'price', type: 'number', required: true, min: 0 },
            { name: 'unit', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'implementation',
      type: 'group',
      admin: {
        description: 'Service implementation details',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Function', value: 'function' },
            { label: 'Workflow', value: 'workflow' },
            { label: 'Agent', value: 'agent' },
          ],
          required: true,
        },
        { name: 'id', type: 'text', required: true },
        { name: 'version', type: 'text' },
        { name: 'configuration', type: 'json' },
      ],
    },
    { name: 'metadata', type: 'json', admin: { description: 'Additional metadata for the service' } },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.pricing || !data.pricing.model) {
          throw new Error('Service pricing model is required');
        }
        
        if (!data.implementation || !data.implementation.type || !data.implementation.id) {
          throw new Error('Service implementation details are required');
        }
        
        if (data.pricing.model === 'cost-based' && !data.pricing.costBase) {
          throw new Error('Cost base is required for cost-based pricing');
        }
        
        if (data.pricing.model === 'margin-based') {
          if (!data.pricing.costBase) {
            throw new Error('Cost base is required for margin-based pricing');
          }
          if (!data.pricing.marginPercentage) {
            throw new Error('Margin percentage is required for margin-based pricing');
          }
        }
        
        if (data.pricing.model === 'activity-based' && (!data.pricing.activities || data.pricing.activities.length === 0)) {
          throw new Error('At least one activity is required for activity-based pricing');
        }
        
        if (data.pricing.model === 'outcome-based' && (!data.pricing.outcomes || data.pricing.outcomes.length === 0)) {
          throw new Error('At least one outcome is required for outcome-based pricing');
        }
        
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        try {
          return doc;
        } catch (error) {
          console.error('Error in service afterChange hook:', error);
          return doc;
        }
      },
    ],
  },
}
