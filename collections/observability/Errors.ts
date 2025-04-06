import type { CollectionConfig } from 'payload'

export const Errors: CollectionConfig = {
  slug: 'errors',
  admin: {
    group: 'Observability',
    useAsTitle: 'message',
  },
  access: {
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'stack',
      type: 'textarea',
      admin: {
        description: 'Error stack trace',
      },
    },
    {
      name: 'digest',
      type: 'text',
      admin: {
        description: 'Error digest for identifying specific errors',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'URL where the error occurred',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Source of the error (client/server/etc)',
      },
    },
  ],
}
