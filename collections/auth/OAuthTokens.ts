import { CollectionConfig } from 'payload'

export const OAuthTokens: CollectionConfig = {
  slug: 'oauth-tokens',
  labels: {
    singular: 'OAuth Token',
    plural: 'OAuth Tokens',
  },
  admin: {
    group: 'Authentication',
    hidden: true,
  },
  access: {
    read: ({ req }) => {
      return Boolean(req.user)
    },
    create: ({ req }) => {
      return Boolean(req.user)
    },
    update: ({ req }) => {
      return Boolean(req.user)
    },
    delete: ({ req }) => {
      return Boolean(req.user)
    },
  },
  fields: [
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'provider',
      type: 'text',
      required: true,
    },
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'clientId',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'scope',
      type: 'text',
    },
  ],
}
