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
          name: 'pricePerUse',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true,
            description: 'Price per use in USD cents (platform fee is 30% above LLM costs)',
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
