import { API } from '@/lib/api'
import { auth } from '@/auth'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const payloadInstance = await getPayload({ config })

    const organizations = await payloadInstance.find({
      collection: 'organizations',
      where: { user: { equals: session.user.id } }
    })
    const organization = organizations.docs[0] || null

    let currentSubscription = null
    let plan = null
    if (organization) {
      const subscriptions = await payloadInstance.find({
        collection: 'subscriptions',
        where: {
          organization: { equals: organization.id },
          status: { equals: 'active' }
        }
      })
      currentSubscription = subscriptions.docs[0] || null
      
      if (currentSubscription?.plan) {
        plan = await payloadInstance.findByID({
          collection: 'billingPlans',
          id: currentSubscription.plan
        })
      }
    }

    return {
      profile: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      },
      organization: organization ? {
        id: organization.id,
        name: organization.name,
        stripeCustomerId: organization.stripeCustomerId,
        email: organization.email
      } : null,
      subscription: currentSubscription ? {
        id: currentSubscription.id,
        status: currentSubscription.status,
        plan: plan ? { id: plan.id, name: plan.name } : currentSubscription.plan,
        periodEnd: currentSubscription.periodEnd
      } : null,
      session: { expires: session.expires }
    }
  } catch (error) {
    console.error('Error fetching profile data:', error)
    return new Response('Error fetching profile data', { status: 500 })
  }
})
