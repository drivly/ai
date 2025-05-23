import { CollectionConfig } from 'payload'

export const OAuthCodes: CollectionConfig = {
  slug: 'oauthCodes',
  labels: {
    singular: 'OAuth Code',
    plural: 'OAuth Codes',
  },
  admin: {
    group: 'Authentication',
    hidden: true,
    description: 'Manages OAuth authorization codes for authentication flows',
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
      name: 'code',
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
      name: 'redirectUri',
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
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'used',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
