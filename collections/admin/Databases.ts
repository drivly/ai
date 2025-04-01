import type { CollectionConfig } from 'payload'

export const Databases: CollectionConfig = {
  slug: 'databases',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },
    { 
      name: 'type', 
      type: 'select', 
      options: ['Integrated', 'Dedicated', 'Self-Hosted'],
      defaultValue: 'Integrated',
      required: true,
    },
    { 
      name: 'schemaEnforcement', 
      type: 'select', 
      options: ['flexible', 'enforced'],
      defaultValue: 'flexible',
      required: true,
    },
    { 
      name: 'databaseType', 
      type: 'select', 
      options: ['Mongo', 'Postgres', 'Sqlite'],
      admin: {
        condition: (data) => data?.type === 'Dedicated' || data?.type === 'Self-Hosted',
      },
    },
    { 
      name: 'regions', 
      type: 'select', 
      options: [
        'us-east-1',    // N. Virginia
        'us-west-2',    // Oregon
        'eu-west-1',    // Ireland
        'ap-northeast-1', // Tokyo
        'ap-southeast-1', // Singapore
        'eu-central-1',   // Frankfurt
        'ap-south-1',     // Mumbai
      ],
      admin: {
        condition: (data) => data?.type === 'Dedicated',
      },
    },
    { 
      name: 'nouns', 
      type: 'relationship', 
      relationTo: 'nouns', 
      hasMany: true,
    },
  ],
}
