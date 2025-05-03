import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  try {
    const rawBody = await request.text()
    
    let data: Record<string, any>
    try {
      data = JSON.parse(rawBody)
    } catch (e) {
      const formData = new URLSearchParams(rawBody)
      data = {}
      for (const [key, value] of formData.entries()) {
        data[key] = value
      }
    }

    const payloadInstance = await getPayload({ config })
    const results = await payloadInstance.create({
      collection: 'events',
      data: {
        data,
        type: data.type || 'webhook.slack.received',
        source: 'webhook.slack',
        tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Set default project ID
      },
    })

    console.log('Slack webhook received and processed:', results, data)
    return { results, data }
  } catch (err) {
    console.error('Error processing Slack webhook:', err)
    return new Response('Error processing webhook', { status: 500 })
  }
})
