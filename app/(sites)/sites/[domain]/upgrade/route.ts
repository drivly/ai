import { NextResponse } from 'next/server.js'
import { getPayload } from 'payload'
import config from '@payload-config'
import stripeClient from '@/lib/stripe'
import { getUser } from '@/lib/api'

/**
 * Redirects users to Stripe customer portal to manage their subscription
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
    
    const payload = await getPayload({ config })
    
    const organizations = await payload.find({
      collection: 'organizations',
      where: {
        user: {
          equals: user.id,
        },
      },
    })
    
    if (organizations.docs.length === 0 || !organizations.docs[0].stripeCustomerId) {
      return NextResponse.redirect(`${origin}/sites/${domain}/subscribe`)
    }
    
    const customerId = organizations.docs[0].stripeCustomerId
    
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        organization: {
          equals: organizations.docs[0].id,
        },
        status: {
          in: ['active', 'trialing', 'past_due'],
        },
      },
    })
    
    if (subscriptions.docs.length === 0) {
      return NextResponse.redirect(`${origin}/sites/${domain}/subscribe`)
    }
    
    const session = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/sites/${domain}`,
    })
    
    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
}
