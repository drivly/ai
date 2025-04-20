import type { CollectionConfig } from 'payload'

export const BillingPlans: CollectionConfig = {
  slug: 'billingPlans',
  admin: {
    group: 'Billing',
    useAsTitle: 'name',
    description: 'Define pricing plans for the platform',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the billing plan',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the billing plan',
      },
    },
    {
      name: 'billingType',
      type: 'select',
      required: true,
      options: [
        { label: 'Pre-paid Consumption', value: 'prepaid' },
        { label: 'Post-paid Consumption', value: 'postpaid' },
        { label: 'Subscription', value: 'subscription' },
      ],
      defaultValue: 'subscription',
      admin: {
        description: 'Type of billing model',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount in cents',
      },
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'EUR', value: 'eur' },
        { label: 'GBP', value: 'gbp' },
      ],
      defaultValue: 'usd',
      required: true,
    },
    {
      name: 'interval',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'month' },
        { label: 'Yearly', value: 'year' },
      ],
      defaultValue: 'month',
      admin: {
        condition: (data) => data?.billingType === 'subscription',
        description: 'Billing interval for subscriptions',
      },
    },
    {
      name: 'credits',
      type: 'number',
      admin: {
        condition: (data) => data?.billingType === 'prepaid',
        description: 'Number of credits included (for pre-paid plans)',
      },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: {
        description: 'Stripe Product ID (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        description: 'Stripe Price ID (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this plan is active and available for purchase',
      },
    },
  ],
}
