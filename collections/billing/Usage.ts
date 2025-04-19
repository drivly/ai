import type { CollectionConfig } from 'payload'

export const Usage: CollectionConfig = {
  slug: 'usage',
  admin: {
    group: 'Billing',
    useAsTitle: 'id',
    description: 'Record consumption for usage-based billing',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
      admin: {
        description: 'Stripe customer for this usage record',
      },
    },
    {
      name: 'resourceType',
      type: 'select',
      options: [
        { label: 'Function', value: 'function' },
        { label: 'Workflow', value: 'workflow' },
        { label: 'Agent', value: 'agent' },
      ],
      required: true,
      admin: {
        description: 'Type of resource being used',
      },
    },
    {
      name: 'resourceId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the resource being used',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount of usage (tokens, requests, compute time, etc.)',
      },
    },
    {
      name: 'unit',
      type: 'select',
      options: [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Requests', value: 'requests' },
        { label: 'Compute Time (ms)', value: 'compute_ms' },
        { label: 'Credits', value: 'credits' },
      ],
      required: true,
      admin: {
        description: 'Unit of measurement for the usage',
      },
    },
    {
      name: 'cost',
      type: 'number',
      admin: {
        description: 'Cost in cents for this usage (if applicable)',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      admin: {
        description: 'When this usage occurred',
      },
    },
    {
      name: 'stripeUsageRecordId',
      type: 'text',
      admin: {
        description: 'Stripe Usage Record ID (if applicable)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this usage',
      },
    },
  ],
}
