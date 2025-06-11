import type { Database } from '@/payload.types'
import type { CollectionConfig, Condition } from 'payload'

export const Databases: CollectionConfig = {
  slug: 'databases',
  admin: {
    group: 'Projects',
    useAsTitle: 'name',
    description: 'Manages database connections and configurations',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      options: ['Integrated', 'Dedicated', 'Self_Hosted'],
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
        condition: ((data) => data?.type === 'Dedicated' || data?.type === 'Self_Hosted') as Condition<Database>,
      },
    },
    {
      name: 'regions',
      type: 'select',
      options: [
        'us-east-1', // N. Virginia
        'us-east-2', // Ohio
        'us-west-1', // N. California
        'us-west-2', // Oregon
        'eu-west-1', // Ireland
        'ap-northeast-1', // Tokyo
        'ap-southeast-1', // Singapore
        'eu-central-1', // Frankfurt
        'ap-south-1', // Mumbai
      ],
      admin: {
        condition: ((data) => data?.type === 'Dedicated') as Condition<Database>,
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
