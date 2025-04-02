import { CollectionConfig } from 'payload'

export const OAuthClients: CollectionConfig = {
  slug: 'oauth-clients',
  admin: {
    useAsTitle: 'name',
    group: 'Authentication',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return true
    },
    create: ({ req }) => {
      return Boolean(req.user)
    },
    update: ({ req, id }) => {
      if (!req.user) return false
      return true
    },
    delete: ({ req }) => {
      if (!req.user) return false
      return true
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'clientId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'clientSecret',
      type: 'text',
      required: true,
    },
    {
      name: 'redirectURLs',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'disabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (req.user) {
          return {
            ...data,
            createdBy: req.user.id,
          }
        }
        return data
      },
    ],
  },
}
