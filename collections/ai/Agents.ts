import type { Agent } from '@/payload.types'
import type { CollectionConfig, Condition } from 'payload'

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
        condition: ((data) => data?.public === true) as Condition<Agent>,
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
            condition: ((_data, siblingData) => siblingData?.isMonetized === true) as Condition<Agent, Agent['pricing']>,
            description: 'Billing model for this agent',
          },
        },
        {
          name: 'pricePerUse',
          type: 'number',
          min: 0,
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true && siblingData?.billingModel === 'payPerUse') as Condition<Agent, Agent['pricing']>,
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
            condition: ((_data, siblingData) => siblingData?.isMonetized === true && ['prepaid', 'postpaid'].includes(siblingData?.billingModel || '')) as Condition<
              Agent,
              Agent['pricing']
            >,
            description: 'Unit of measurement for consumption',
          },
        },
        {
          name: 'consumptionRate',
          type: 'number',
          min: 0,
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true && ['prepaid', 'postpaid'].includes(siblingData?.billingModel || '')) as Condition<
              Agent,
              Agent['pricing']
            >,
            description: 'Price per consumption unit in USD cents',
          },
        },
        {
          name: 'billingPlan',
          type: 'relationship',
          relationTo: 'billingPlans',
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true && siblingData?.billingModel === 'subscription') as Condition<Agent, Agent['pricing']>,
            description: 'Subscription plan for this agent',
          },
        },
        {
          name: 'stripeProductId',
          type: 'text',
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true) as Condition<Agent, Agent['pricing']>,
            description: 'Stripe Product ID (auto-generated)',
            readOnly: true,
          },
        },
        {
          name: 'stripePriceId',
          type: 'text',
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true) as Condition<Agent, Agent['pricing']>,
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
        description: 'Goals to which this agent contributes',
      },
    },
  ],
}
