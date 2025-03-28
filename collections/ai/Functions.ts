import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  // versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'type',
          type: 'select',
          options: ['Generation', 'Code', 'Human', 'Agent'],
          defaultValue: 'Generation',
          required: true,
        },
      ],
    },
    {
      name: 'format',
      type: 'select',
      options: ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code'],
      defaultValue: 'Object',
      required: true,
      admin: {
        condition: (data) => data?.type === 'Generation',
      },
    },
    {
      name: 'schema',
      type: 'json',
      admin: {
        condition: (data) => (data?.type === 'Generation' && ['Object', 'ObjectArray'].includes(data?.format)) || ['Human', 'Agent'].includes(data?.type),
        editorOptions: { padding: { top: 20, bottom: 20 } },
      },
    },
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
        condition: (data) => data?.type !== 'Code',
      },
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'Human',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        condition: (data) => data?.type === 'Human',
      },
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      admin: {
        condition: (data) => data?.type === 'Agent',
      },
    },
    { name: 'actions', type: 'join', collection: 'actions', on: 'function' },
  ],
}
