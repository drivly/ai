import { API } from '@/lib/api'
import config from '@payload-config'
import { getPayload } from 'payload'

export const POST = API(async (request, { db, user, origin, url, domain, params }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { resourceType, resourceId, quantity, unit } = await request.json()

  if (!resourceType || !resourceId || !quantity || !unit) {
    return new Response('Missing required fields', { status: 400 })
  }

  try {
    const payloadInstance = await getPayload({ config })

    const customers = await payloadInstance.find({
      collection: 'organizations',
      where: {
        user: {
          equals: user.id,
        },
      },
    })

    if (customers.docs.length === 0) {
      return new Response('No Stripe customer found for user', { status: 404 })
    }

    const customerId = customers.docs[0].id

    const usageRecord = await payloadInstance.create({
      collection: 'usage',
      data: {
        organization: customerId,
        resourceType,
        resourceId,
        quantity,
        unit,
        timestamp: new Date().toISOString(),
        metadata: {
          userId: user.id,
        },
      } as any,
    })

    return { success: true, usage: usageRecord }
  } catch (error) {
    console.error('Error recording usage:', error)
    return new Response('Error recording usage', { status: 500 })
  }
})

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const payloadInstance = await getPayload({ config })

    const customers = await payloadInstance.find({
      collection: 'organizations',
      where: {
        user: {
          equals: user.id,
        },
      },
    })

    if (customers.docs.length === 0) {
      return new Response('No Stripe customer found for user', { status: 404 })
    }

    const customerId = customers.docs[0].id

    const usage = await payloadInstance.find({
      collection: 'usage',
      where: {
        organization: {
          equals: customerId,
        },
      },
      sort: '-timestamp',
      limit: 100,
    })

    return {
      success: true,
      usage: usage.docs,
      totalDocs: usage.totalDocs,
      page: usage.page,
      totalPages: usage.totalPages,
    }
  } catch (error) {
    console.error('Error fetching usage:', error)
    return new Response('Error fetching usage', { status: 500 })
  }
})
