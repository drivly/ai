import type { CollectionConfig } from 'payload'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: {
    group: 'Billing',
    useAsTitle: 'name',
    description: 'Organizations that can be Stripe customers',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the organization',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Primary user associated with this organization',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stripe Customer ID',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Email address used for this organization',
      },
    },
    {
      name: 'billingDetails',
      type: 'json',
      admin: {
        description: 'Additional billing details from Stripe',
      },
    },
    {
      name: 'defaultPaymentMethod',
      type: 'text',
      admin: {
        description: 'Default payment method ID',
      },
    },
    {
      name: 'members',
      type: 'array',
      admin: {
        description: 'Users who are members of this organization',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Member', value: 'member' },
            { label: 'Viewer', value: 'viewer' },
          ],
          defaultValue: 'member',
          required: true,
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata from Stripe',
      },
    },
  ],
}
