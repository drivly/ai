import { API } from '@/lib/api'
import config from '@payload-config'
import { getPayload } from 'payload'

export const POST = API(async (request, { db, user, origin, url, domain, params }) => {
  const sourceParam = params.source

  if (!sourceParam) {
    console.error('Missing source parameter')
    return new Response('Missing source parameter', { status: 400 })
  }

  const source = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam

  const rawBody = await request.text()

  try {
    const data = JSON.parse(rawBody)

    const payloadInstance = await getPayload({ config })
    const results = await payloadInstance.create({
      collection: 'events',
      data: {
        data,
        type: data.type || 'webhook.received',
        source: source,
        tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Set default project ID
      },
    })

    console.log(`Webhook from ${source} processed:`, results)
    return { results, data }
  } catch (err) {
    console.error(`Webhook from ${source} processing failed:`, err)
    return new Response('Webhook processing failed', { status: 400 })
  }
})
