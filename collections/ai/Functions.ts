import type { CollectionConfig } from 'payload'
import yaml from 'yaml'
import { generateFunctionExamplesTask } from '@/tasks/ai/generateFunctionExamples'
import { simplerJSON } from 'payload-utils'

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
        condition: (data) => data?.clonedFrom !== undefined && data?.clonedFrom !== null,
      },
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.public === true,
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
            condition: (data, siblingData) => siblingData?.isMonetized === true,
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
            condition: (data, siblingData) => siblingData?.isMonetized === true && ['prepaid', 'postpaid'].includes(siblingData?.billingModel),
            description: 'Unit of measurement for consumption',
          },
        },
        {
          name: 'consumptionRate',
          type: 'number',
          min: 0,
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true && ['prepaid', 'postpaid'].includes(siblingData?.billingModel),
            description: 'Price per consumption unit in USD cents',
          },
        },
        {
          name: 'billingPlan',
          type: 'relationship',
          relationTo: 'billingPlans',
          admin: {
            condition: (data, siblingData) => siblingData?.isMonetized === true && siblingData?.billingModel === 'subscription',
            description: 'Subscription plan for this function',
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
        condition: (data) => data?.type === 'Generation',
      },
    },
    // {
    //   name: 'shape',
    //   type: 'relationship',
    //   relationTo: 'types',
    //   admin: {
    //     position: 'sidebar',
    //     condition: (data) => (data?.type === 'Generation' && ['Object', 'ObjectArray'].includes(data?.format || '')) || ['Human', 'Agent'].includes(data?.type || ''),
    //   },
    // },
    ...(simplerJSON as any)({
      jsonFieldName: 'shape',
      codeFieldName: 'schemaYaml',
      label: 'Schema',
      defaultFormat: 'yaml',
      adminCondition: (data: any) => (data?.type === 'Generation' && ['Object', 'ObjectArray'].includes(data?.format || '')) || ['Human', 'Agent'].includes(data?.type || ''),
      editorOptions: { lineNumbers: 'off', padding: { top: 20, bottom: 20 } },
      hideJsonField: true,
    }),
    {
      name: 'code',
      type: 'code',
      admin: {
        language: 'typescript',
        condition: (data) => data?.type === 'Code',
        editorOptions: { padding: { top: 20, bottom: 20 } },
      },
    },
    {
      name: 'prompt',
      type: 'relationship',
      relationTo: 'prompts',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'Generation',
      },
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'Human',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'Human',
      },
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'Agent',
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
        description: 'Goals this function contributes to',
      },
    },
  ],
}
