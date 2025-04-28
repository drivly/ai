import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Webhook } from 'svix'

function sanitizeDataForMongoDB(data: any): any {
  if (data === null || data === undefined) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDataForMongoDB(item))
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
      if (!key.startsWith('$') && !key.includes('.')) {
        sanitized[key] = sanitizeDataForMongoDB(value)
      }
    }
    return sanitized
  }

  if (typeof data === 'string' && data.length === 24 && /^[0-9a-fA-F]{24}$/.test(data)) {
    return `id_${data}`
  }

  return data
}

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
  const connectionId = url.searchParams.get('connectionId')

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

    const sanitizedData = sanitizeDataForMongoDB(data)

    // Store the event in the database
    const payloadInstance = await getPayload({ config })

    if (connectionId) {
      try {
        let newStatus: 'active' | 'rejected' | null = null
        if (data.status === 'connected' || data.status === 'success') {
          newStatus = 'active'
        } else if (data.status === 'failed' || data.status === 'error') {
          newStatus = 'rejected'
        }

        if (newStatus) {
          await payloadInstance.update({
            collection: 'connectAccounts',
            id: connectionId,
            data: {
              status: newStatus,
              metadata: {
                lastUpdated: new Date().toISOString(),
                webhookEvent: data.type || 'unknown',
                webhookData: sanitizedData
              },
            },
          })
        }
      } catch (error) {
        console.error('Failed to update connection status:', error)
      }
    }
    const results = await payloadInstance.create({
      collection: 'events',
      data: {
        data: sanitizedData,
        tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Set default project ID
        type: data.type || 'webhook.composio', // Set default type
        source: 'composio', // Set source
      },
    })

    console.log('Webhook verified and processed:', results, data)
    return { results, data }
  } catch (err) {
    console.error('Webhook verification failed:', err)
    if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' && err.message.includes('tenant')) {
      return new Response('Tenant validation failed: ' + err.message, { status: 400 })
    }
    return new Response('Webhook verification failed', { status: 401 })
  }
})
