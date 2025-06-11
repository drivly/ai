import type { Function } from '@/payload.types'
import type { CollectionConfig, Condition } from 'payload'
import { simplerJSON } from '../../src/utils/json-fields'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
    description: 'Reusable AI capabilities with typed inputs and outputs',
  },
  // versions: true,
  fields: [
    // {
    //   type: 'row',
    //   fields: [
    { name: 'name', type: 'text', required: true, admin: { position: 'sidebar' } },
    {
      name: 'type',
      type: 'select',
      options: ['Generation', 'Code', 'Human', 'Agent'],
      defaultValue: 'Generation',
      // required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Make this function available to other users',
      },
    },
    {
      name: 'clonedFrom',
      type: 'relationship',
      relationTo: 'functions',
      admin: {
        position: 'sidebar',
        description: 'Original function this was cloned from',
        condition: ((data) => data?.clonedFrom !== undefined && data?.clonedFrom !== null) as Condition<Function>,
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        position: 'sidebar',
        condition: ((data) => data?.public === true) as Condition<Function>,
        description: 'Monetization settings for this function',
      },
      fields: [
        {
          name: 'isMonetized',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable monetization for this function',
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
            condition: ((_data, siblingData) => siblingData?.isMonetized === true) as Condition<Function, Function['pricing']>,
            description: 'Billing model for this function',
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
            condition: ((_data, siblingData) => siblingData?.isMonetized === true && ['prepaid', 'postpaid'].includes(siblingData?.billingModel || '')) as Condition<
              Function,
              Function['pricing']
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
              Function,
              Function['pricing']
            >,
            description: 'Price per consumption unit in USD cents',
          },
        },
        {
          name: 'billingPlan',
          type: 'relationship',
          relationTo: 'billingPlans',
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true && siblingData?.billingModel === 'subscription') as Condition<Function, Function['pricing']>,
            description: 'Subscription plan for this function',
          },
        },
        {
          name: 'stripeProductId',
          type: 'text',
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true) as Condition<Function, Function['pricing']>,
            description: 'Stripe Product ID (auto-generated)',
            readOnly: true,
          },
        },
        {
          name: 'stripePriceId',
          type: 'text',
          admin: {
            condition: ((_data, siblingData) => siblingData?.isMonetized === true) as Condition<Function, Function['pricing']>,
            description: 'Stripe Price ID (auto-generated)',
            readOnly: true,
          },
        },
      ],
    },
    //   ],
    // },
    {
      name: 'format',
      type: 'select',
      options: ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code', 'Video'],
      defaultValue: 'Object',
      // required: true,
      admin: {
        position: 'sidebar',
        condition: ((data) => data?.type === 'Generation') as Condition<Function>,
      },
    },
    // {
    //   name: 'shape',
    //   type: 'relationship',
    //   relationTo: 'types',
    //   admin: {
    //     position: 'sidebar',
    //     condition: ((data) => (data?.type === 'Generation' && ['Object', 'ObjectArray'].includes(data?.format || '')) || ['Human', 'Agent'].includes(data?.type || '')) as Condition<Function>,
    //   },
    // },
    ...simplerJSON<Function>({
      jsonFieldName: 'shape',
      codeFieldName: 'schemaYaml',
      label: 'Schema',
      defaultFormat: 'yaml',
      adminCondition: (data) => (data?.type === 'Generation' && ['Object', 'ObjectArray'].includes(data?.format || '')) || ['Human', 'Agent'].includes(data?.type || ''),
      editorOptions: { lineNumbers: 'off', padding: { top: 20, bottom: 20 } },
      hideJsonField: true,
    }),
    {
      name: 'code',
      type: 'code',
      admin: {
        language: 'typescript',
        condition: ((data) => data?.type === 'Code') as Condition<Function>,
        editorOptions: { padding: { top: 20, bottom: 20 } },
      },
    },
    {
      name: 'prompt',
      type: 'relationship',
      relationTo: 'prompts',
      admin: {
        position: 'sidebar',
        condition: ((data) => data?.type === 'Generation') as Condition<Function>,
      },
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        position: 'sidebar',
        condition: ((data) => data?.type === 'Human') as Condition<Function>,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        condition: ((data) => data?.type === 'Human') as Condition<Function>,
      },
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      admin: {
        position: 'sidebar',
        condition: ((data) => data?.type === 'Agent') as Condition<Function>,
      },
    },
    // { name: 'executions', type: 'join', collection: 'actions', on: 'functionId' },
    {
      name: 'examples',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
      admin: {
        description: 'Example arguments for this function',
      },
    },
    {
      name: 'goals',
      type: 'relationship',
      relationTo: 'goals',
      hasMany: true,
      admin: {
        description: 'Goals to which this function contributes',
      },
    },
  ],
}
