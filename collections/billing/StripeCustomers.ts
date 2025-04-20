import type { CollectionConfig } from 'payload'

export const StripeCustomers: CollectionConfig = {
  slug: 'stripeCustomers',
  admin: {
    group: 'Billing',
    useAsTitle: 'id',
    description: 'Links between users and Stripe customers',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        description: 'User associated with this Stripe customer',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stripe Customer ID',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Email address used for this Stripe customer',
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
  ],
}
