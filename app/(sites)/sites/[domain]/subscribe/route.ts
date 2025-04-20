import { NextResponse } from 'next/server.js'
import { getPayload } from 'payload'
import config from '@payload-config'
import stripeClient from '@/lib/stripe'
import { getUser } from '@/lib/api'

/**
 * Redirects users to Stripe checkout for subscription
 * Ticket: ENG-698
 */
export async function GET(request: Request, { params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  try {
    const user = await getUser(request)
    
    if (!user.authenticated) {
      const url = new URL(request.url)
      const redirectUrl = new URL('/login', url.origin)
      redirectUrl.searchParams.set('redirect', url.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    const { domain } = params
    
    const url = new URL(request.url)
    const origin = url.origin
    
    const planId = url.searchParams.get('plan')
    
    const payload = await getPayload({ config })
    
    let plan
    if (planId) {
      plan = await payload.findByID({
        collection: 'billingPlans',
        id: planId,
      })
    } else {
      const plans = await payload.find({
        collection: 'billingPlans',
        where: {
          isActive: {
            equals: true,
          },
          billingType: {
            equals: 'subscription',
          },
        },
        limit: 1,
      })
      
      if (plans.docs.length === 0) {
        return NextResponse.json(
          { error: 'No active subscription plans available' },
          { status: 404 }
        )
      }
      
      plan = plans.docs[0]
    }
    
    if (!plan || !plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Selected plan is not available for subscription' },
        { status: 400 }
      )
    }
    
    let customerId
    const organizations = await payload.find({
      collection: 'organizations',
      where: {
        user: {
          equals: user.id,
        },
      },
    })
    
    if (organizations.docs.length > 0 && organizations.docs[0].stripeCustomerId) {
      customerId = organizations.docs[0].stripeCustomerId
    } else {
      const customer = await stripeClient.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      })
      
      customerId = customer.id
      
      if (organizations.docs.length > 0) {
        await payload.update({
          collection: 'organizations',
          id: organizations.docs[0].id,
          data: {
            stripeCustomerId: customerId,
          },
        })
      } else {
        await payload.create({
          collection: 'organizations',
          data: {
            name: user.name ? `Organization for ${user.name}` : `Organization for ${user.email}`,
            user: user.id,
            stripeCustomerId: customerId,
            email: user.email,
          },
        })
      }
    }
    
    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/sites/${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/sites/${domain}/canceled`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        domain,
      },
    })
    
    return NextResponse.redirect(session.url as string)
  } catch (error) {
    console.error('Error creating subscription checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
