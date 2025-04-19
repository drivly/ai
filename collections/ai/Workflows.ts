import type { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
    description: 'Orchestrates functions into reusable business processes',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'type', type: 'code', admin: { language: 'typescript', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'code', type: 'code', admin: { language: 'typescript', editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'functions', type: 'relationship', relationTo: 'functions' },
    { name: 'module', type: 'relationship', relationTo: 'modules' },
    { name: 'package', type: 'relationship', relationTo: 'packages' },
    { name: 'deployment', type: 'relationship', relationTo: 'deployments' },
    {
      name: 'goals',
      type: 'relationship',
      relationTo: 'goals',
      hasMany: true,
      admin: {
        description: 'Goals this workflow contributes to',
      },
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Make this workflow available to other users',
      },
    },
    {
      name: 'clonedFrom',
      type: 'relationship',
      relationTo: 'workflows',
      admin: {
        position: 'sidebar',
        description: 'Original workflow this was cloned from',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.public === true,
        description: 'Monetization settings for this workflow',
      },
      fields: [
        {
          name: 'isMonetized',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable monetization for this workflow',
          },
        },
        {
          name: 'billingModel',
          type: 'select',
          options: [
            { label: 'Pay Per Use', value: 'payPerUse' },
            { label: 'Pre-paid Credits', value: 'prepaid' },
            { label: 'Post-paid Usage', value: 'postpaid' },
            { label: 'Subscription', value: 'subscription' },
          ],
          defaultValue: 'payPerUse',
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true,
            description: 'Billing model for this workflow',
          },
        },
        {
          name: 'pricePerUse',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true && siblingData?.billingModel === 'payPerUse',
            description: 'Price per use in USD cents (platform fee is 30% above LLM costs)',
          },
        },
        {
          name: 'consumptionUnit',
          type: 'select',
          options: [
            { label: 'Tokens', value: 'tokens' },
            { label: 'Requests', value: 'requests' },
            { label: 'Compute Time (ms)', value: 'compute_ms' },
          ],
          defaultValue: 'requests',
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true && 
              ['prepaid', 'postpaid'].includes(siblingData?.billingModel),
            description: 'Unit of measurement for consumption',
          },
        },
        {
          name: 'consumptionRate',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true && 
              ['prepaid', 'postpaid'].includes(siblingData?.billingModel),
            description: 'Price per consumption unit in USD cents',
          },
        },
        {
          name: 'billingPlan',
          type: 'relationship',
          relationTo: 'billingPlans',
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true && 
              siblingData?.billingModel === 'subscription',
            description: 'Subscription plan for this workflow',
          },
        },
        {
          name: 'stripeProductId',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true,
            description: 'Stripe Product ID (auto-generated)',
            readOnly: true,
          },
        },
        {
          name: 'stripePriceId',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true,
            description: 'Stripe Price ID (auto-generated)',
            readOnly: true,
          },
        },
      ],
    },
  ],
}
