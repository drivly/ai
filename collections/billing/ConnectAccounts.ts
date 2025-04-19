import type { CollectionConfig } from 'payload'

export const ConnectAccounts: CollectionConfig = {
  slug: 'connectAccounts',
  admin: {
    group: 'Billing',
    useAsTitle: 'id',
    description: 'Store Stripe Connect account information',
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      admin: {
        description: 'Project associated with this Connect account',
      },
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stripe Connect Account ID',
      },
    },
    {
      name: 'accountType',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Express', value: 'express' },
        { label: 'Custom', value: 'custom' },
      ],
      defaultValue: 'standard',
      required: true,
      admin: {
        description: 'Type of Stripe Connect account',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Restricted', value: 'restricted' },
        { label: 'Rejected', value: 'rejected' },
      ],
      required: true,
      defaultValue: 'pending',
      admin: {
        description: 'Current status of the Connect account',
      },
    },
    {
      name: 'chargesEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether charges are enabled for this account',
      },
    },
    {
      name: 'payoutsEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether payouts are enabled for this account',
      },
    },
    {
      name: 'platformFeePercent',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 10,
      admin: {
        description: 'Platform fee percentage for this account',
      },
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
