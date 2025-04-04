import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'
import yaml from 'yaml'
import { generateFunctionExamplesTask } from '../../tasks/generateFunctionExamples'
import { simplerJSON } from '../../lib/fields/simplerJSON'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  // versions: true,
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const { payload } = req
        
        if (doc.type === 'Code' && doc.code) {
          try {
            const job = await payload.jobs.queue({
              task: 'processCodeFunction',
              input: {
                functionId: doc.id
              }
            })
            
            console.log(`Queued process code function for ${doc.name}`, job)
            waitUntil(payload.jobs.runByID({ id: job.id }))
          } catch (error) {
            console.error('Error queueing processCodeFunction task:', error)
          }
        }
        
        if (!doc.examples || doc.examples.length === 0) {
          try {
            const job = await payload.jobs.queue({
              task: generateFunctionExamplesTask.slug,
              input: {
                functionId: doc.id,
                count: 3
              }
            })
            
            console.log(`Queued example generation for ${doc.name}`, job)
            waitUntil(payload.jobs.runByID({ id: job.id }))
          } catch (error) {
            console.error('Error queueing generateFunctionExamples task:', error)
          }
        }
        
        return doc
      },
    ],
  },
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
          admin: { position: 'sidebar' } 
        },
        { 
          name: 'public', 
          type: 'checkbox', 
          defaultValue: false,
          admin: { 
            position: 'sidebar',
            description: 'Make this function available to other users'
          } 
        },
        { 
          name: 'clonedFrom', 
          type: 'relationship', 
          relationTo: 'functions',
          admin: { 
            position: 'sidebar',
            description: 'Original function this was cloned from'
          } 
        },
        { 
          name: 'pricing', 
          type: 'group', 
          admin: {
            position: 'sidebar',
            condition: (data) => data?.public === true,
            description: 'Monetization settings for this function'
          },
          fields: [
            {
              name: 'isMonetized',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable monetization for this function'
              }
            },
            {
              name: 'pricePerUse',
              type: 'number',
              min: 0,
              admin: {
                condition: (data, siblingData) => siblingData?.isMonetized === true,
                description: 'Price per use in USD cents (platform fee is 30% above LLM costs)'
              }
            },
            {
              name: 'stripeProductId',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.isMonetized === true,
                description: 'Stripe Product ID (auto-generated)',
                readOnly: true
              }
            },
            {
              name: 'stripePriceId',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.isMonetized === true,
                description: 'Stripe Price ID (auto-generated)',
                readOnly: true
              }
            }
          ]
        },
    //   ],
    // },
    {
      name: 'format',
      type: 'select',
      options: ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code'],
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
    ...simplerJSON({
      jsonFieldName: 'shape',
      codeFieldName: 'schemaYaml',
      label: 'Schema',
      defaultFormat: 'yaml',
      adminCondition: (data) => (data?.type === 'Generation' && ['Object', 'ObjectArray'].includes(data?.format || '')) || ['Human', 'Agent'].includes(data?.type || ''),
      editorOptions: { lineNumbers: 'off', padding: { top: 20, bottom: 20 } },
      hideJsonField: true
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
        description: 'Example arguments for this function'
      }
    },
  ],
}
