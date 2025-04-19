import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'

export const POST = API(async (request, { db, user, origin, url, domain, params }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { projectId, accountType = 'standard' } = await request.json()
  
  if (!projectId) {
    return new Response('Missing project ID', { status: 400 })
  }
  
  try {
    const payloadInstance = await getPayload({ config })
    
    const project = await payloadInstance.findByID({
      collection: 'projects',
      id: projectId,
    })
    
    if (!project) {
      return new Response('Project not found', { status: 404 })
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2022-08-01',
    })
    
    const existingAccounts = await payloadInstance.find({
      collection: 'connections',
      where: {
        project: {
          equals: projectId,
        },
      },
    })
    
    if (existingAccounts.docs.length > 0) {
      const account = existingAccounts.docs[0]
      
      if (account.status !== 'active') {
        const accountLink = await stripe.accountLinks.create({
          account: account.stripeAccountId,
          refresh_url: `${origin}/admin/projects/${projectId}/connect/refresh`,
          return_url: `${origin}/admin/projects/${projectId}/connect/complete`,
          type: 'account_onboarding',
        })
        
        return {
          success: true,
          account,
          accountLink: accountLink.url,
        }
      }
      
      return {
        success: true,
        account,
      }
    }
    
    const stripeAccount = await stripe.accounts.create({
      type: accountType,
      metadata: {
        projectId,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    
    const connectAccount = await payloadInstance.create({
      collection: 'connections',
      data: {
        project: projectId,
        stripeAccountId: stripeAccount.id,
        accountType,
        status: 'pending',
        chargesEnabled: false,
        payoutsEnabled: false,
        platformFeePercent: 10, // Default platform fee
        metadata: {
          projectId,
        },
      },
    })
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccount.id,
      refresh_url: `${origin}/admin/projects/${projectId}/connect/refresh`,
      return_url: `${origin}/admin/projects/${projectId}/connect/complete`,
      type: 'account_onboarding',
    })
    
    return {
      success: true,
      account: connectAccount,
      accountLink: accountLink.url,
    }
  } catch (error) {
    console.error('Error creating Connect account:', error)
    return new Response('Error creating Connect account', { status: 500 })
  }
})

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { projectId } = Object.fromEntries(new URL(request.url).searchParams)
  
  if (!projectId) {
    return new Response('Missing project ID', { status: 400 })
  }
  
  try {
    const payloadInstance = await getPayload({ config })
    
    const project = await payloadInstance.findByID({
      collection: 'projects',
      id: projectId,
    })
    
    if (!project) {
      return new Response('Project not found', { status: 404 })
    }
    
    const connectAccounts = await payloadInstance.find({
      collection: 'connections',
      where: {
        project: {
          equals: projectId,
        },
      },
    })
    
    return {
      success: true,
      accounts: connectAccounts.docs,
    }
  } catch (error) {
    console.error('Error fetching Connect accounts:', error)
    return new Response('Error fetching Connect accounts', { status: 500 })
  }
})
