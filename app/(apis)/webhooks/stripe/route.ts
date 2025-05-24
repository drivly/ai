import { API } from '@/lib/api'
import config from '@payload-config'
import { getPayload, Payload } from 'payload'
import Stripe from 'stripe'

export const POST = API(async (request, { db, user, origin, url, domain, params }) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-08-01',
  })

  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing Stripe signature', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    const payloadInstance = await getPayload({ config })

    switch (event.type) {
      case 'customer.created':
      case 'customer.updated':
        await handleCustomerEvent(payloadInstance, event)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(payloadInstance, event)
        break

      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
        await handlePaymentEvent(payloadInstance, event)
        break

      case 'account.updated':
      case 'account.application.authorized':
      case 'account.application.deauthorized':
        await handleConnectAccountEvent(payloadInstance, event)
        break

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }

    const results = await payloadInstance.create({
      collection: 'events',
      data: {
        data: JSON.parse(JSON.stringify(event)),
        type: event.type,
        source: 'stripe',
        tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Set default project ID
      },
    })

    console.log(`Stripe webhook processed: ${event.type}`)
    return { success: true, event: event.type }
  } catch (err) {
    console.error('Stripe webhook processing failed:', err)
    return new Response('Webhook processing failed', { status: 400 })
  }
})

async function handleCustomerEvent(payload: Payload, event: Stripe.Event) {
  const customer = event.data.object as Stripe.Customer

  try {
    const existingCustomers = await payload.find({
      collection: 'organizations',
      where: {
        stripeCustomerId: {
          equals: customer.id,
        },
      },
    })

    if (existingCustomers.docs.length > 0) {
      await payload.update({
        collection: 'organizations',
        id: existingCustomers.docs[0].id,
        data: {
          email: customer.email,
          billingDetails: {}, // Customer object doesn't have billing_details property
          metadata: customer.metadata,
        },
      })
    } else if (customer.metadata?.userId) {
      await payload.create({
        collection: 'organizations',
        data: {
          name: customer.name || `Organization for ${customer.email || 'Unknown User'}`,
          user: customer.metadata.userId,
          stripeCustomerId: customer.id,
          email: customer.email,
          billingDetails: {}, // Customer object doesn't have billing_details property
          metadata: customer.metadata,
        },
      })
    }
  } catch (error) {
    console.error('Error handling customer event:', error)
  }
}

async function handleSubscriptionEvent(payload: Payload, event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription

  try {
    const customers = await payload.find({
      collection: 'organizations',
      where: {
        stripeCustomerId: {
          equals: subscription.customer,
        },
      },
    })

    if (customers.docs.length === 0) {
      console.log(`No customer found for Stripe customer ID: ${subscription.customer}`)
      return
    }

    const customerId = customers.docs[0].id

    let planId = null
    if (subscription.items?.data?.[0]?.price?.id) {
      const plans = await payload.find({
        collection: 'billingPlans',
        where: {
          stripePriceId: {
            equals: subscription.items.data[0].price.id,
          },
        },
      })

      if (plans.docs.length > 0) {
        planId = plans.docs[0].id
      }
    }

    const existingSubscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: {
          equals: subscription.id,
        },
      },
    })

    if (existingSubscriptions.docs.length > 0) {
      await payload.update({
        collection: 'subscriptions',
        id: existingSubscriptions.docs[0].id,
        data: {
          status: subscription.status,
          periodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          periodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      })
    } else if (customerId && planId) {
      await payload.create({
        collection: 'subscriptions',
        data: {
          organization: customerId,
          plan: planId,
          status: subscription.status,
          stripeSubscriptionId: subscription.id,
          periodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          periodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        } as any,
      })
    }
  } catch (error) {
    console.error('Error handling subscription event:', error)
  }
}

async function handlePaymentEvent(payload: Payload, event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  console.log(`Payment event processed: ${event.type}`)
}

async function handleConnectAccountEvent(payload: Payload, event: Stripe.Event) {
  const account = event.data.object as Stripe.Account

  try {
    const existingAccounts = await payload.find({
      collection: 'connectAccounts',
      where: {
        stripeAccountId: {
          equals: account.id,
        },
      },
    })

    if (existingAccounts.docs.length > 0) {
      await payload.update({
        collection: 'connectAccounts',
        id: existingAccounts.docs[0].id,
        data: {
          status: account.charges_enabled ? 'active' : 'pending',
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          metadata: account.metadata,
        },
      })
    } else if (account.metadata?.projectId) {
      await payload.create({
        collection: 'connectAccounts',
        data: {
          name: `Connect Account for Project ${account.metadata.projectId}`,
          project: account.metadata.projectId,
          stripeAccountId: account.id,
          accountType: account.type,
          status: account.charges_enabled ? 'active' : 'pending',
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          platformFeePercent: 10, // Default platform fee
          metadata: account.metadata,
        },
      })
    }
  } catch (error) {
    console.error('Error handling Connect account event:', error)
  }
}
