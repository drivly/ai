import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const payloadInstance = await getPayload({ config })

    const organizations = await payloadInstance.find({
      collection: 'organizations',
      where: {
        user: {
          equals: user.id,
        },
      },
    })

    if (organizations.docs.length === 0) {
      return new Response('No organization found for this user', { status: 404 })
    }

    const organization = organizations.docs[0]

    if (!organization.stripeCustomerId) {
      return new Response('No Stripe customer ID found for this organization', { status: 404 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2022-08-01',
    })

    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: `${origin}/account`,
    })

    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error('Error creating Stripe customer portal session:', error)
    return new Response('Error creating Stripe customer portal session', { status: 500 })
  }
})
