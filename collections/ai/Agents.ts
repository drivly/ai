import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
    description: 'Autonomous AI agents that can perform tasks using functions and workflows',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Make this agent available to other users',
      },
    },
    {
      name: 'clonedFrom',
      type: 'relationship',
      relationTo: 'agents',
      admin: {
        position: 'sidebar',
        description: 'Original agent this was cloned from',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.isPublic === true,
        description: 'Monetization settings for this agent',
      },
      fields: [
        {
          name: 'isMonetized',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable monetization for this agent',
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
    {
      name: 'goals',
      type: 'relationship',
      relationTo: 'goals',
      hasMany: true,
      admin: {
        description: 'Goals this agent contributes to',
      },
    },
  ],
}
