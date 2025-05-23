import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Webhook } from 'svix'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  // Get the webhook secret from environment variables
  const secret = process.env.COMPOSIO_WEBHOOK_SECRET
  if (!secret) {
    console.error('Missing COMPOSIO_WEBHOOK_SECRET environment variable')
    return new Response('Webhook secret is not configured', { status: 500 })
  }

  // Get the headers
  const webhookId = request.headers.get('webhook-id')
  const webhookTimestamp = request.headers.get('webhook-timestamp')
  const webhookSignature = request.headers.get('webhook-signature')

  // Validate required headers
  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    console.error('Missing webhook headers')
    return new Response('Missing webhook headers', { status: 400 })
  }

  // Get the raw body
  const rawBody = await request.text()

  try {
    // Create a new Webhook instance with the secret
    const wh = new Webhook(secret)

    // Verify the webhook payload
    const payload = wh.verify(rawBody, {
      'webhook-id': webhookId,
      'webhook-timestamp': webhookTimestamp,
      'webhook-signature': webhookSignature,
    })

    // Parse the verified payload
    const data = JSON.parse(rawBody)

    // Store the event in the database
    const payloadInstance = await getPayload({ config })
    const results = await payloadInstance.create({
      collection: 'events',
      data: {
        data,
        type: data.type || 'webhook.received',
        source: 'webhook',
        tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Set default project ID
      },
    })

    console.log('Webhook verified and processed:', results, data)
    return { results, data }
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Webhook verification failed', { status: 401 })
  }
})
