import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    group: 'Billing',
    useAsTitle: 'id',
    description: 'Track active subscriptions',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
      admin: {
        description: 'Stripe customer for this subscription',
      },
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'billingPlans',
      required: true,
      admin: {
        description: 'Billing plan for this subscription',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Incomplete', value: 'incomplete' },
        { label: 'Incomplete Expired', value: 'incomplete_expired' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Unpaid', value: 'unpaid' },
      ],
      required: true,
      admin: {
        description: 'Current status of the subscription',
      },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stripe Subscription ID',
      },
    },
    {
      name: 'periodStart',
      type: 'date',
      admin: {
        description: 'Start of the current billing period',
      },
    },
    {
      name: 'periodEnd',
      type: 'date',
      admin: {
        description: 'End of the current billing period',
      },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the subscription will be canceled at the end of the current period',
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
