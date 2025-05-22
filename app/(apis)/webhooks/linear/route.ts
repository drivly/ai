import { waitUntil } from '@vercel/functions'
import { API } from '@/lib/api'
import { Webhook } from 'svix'

export const POST = API(async (request, { payload }) => {
  const secret = process.env.LINEAR_WEBHOOK_SECRET
  if (!secret) {
    console.error('Missing LINEAR_WEBHOOK_SECRET environment variable')
    return new Response('Webhook secret is not configured', { status: 500 })
  }

  console.log('Received Linear webhook headers:', {
    headers: Object.fromEntries([...request.headers.entries()]),
  })

  const bodyClone = await request.clone().text()
  console.log('Received Linear webhook body:', {
    body: bodyClone,
  })

  const webhookId = request.headers.get('linear-delivery')
  const webhookSignature = request.headers.get('linear-signature')

  let webhookTimestamp: string | null = null
  try {
    const bodyData = JSON.parse(bodyClone)
    webhookTimestamp = bodyData.webhookTimestamp?.toString() || null
  } catch (error) {
    console.error('Failed to parse webhook body:', error)
  }

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    console.error('Missing required Linear webhook data', {
      headers: Object.fromEntries([...request.headers.entries()]),
      hasBody: Boolean(bodyClone),
      requestUrl: request.url,
      method: request.method,
      contentType: request.headers.get('content-type'),
      webhookId,
      webhookSignature,
      webhookTimestamp,
    })
    return new Response('Missing required webhook data', { status: 400 })
  }

  const rawBody = await request.text()

  try {
    const wh = new Webhook(secret)

    const verificationHeaders: Record<string, string> = {
      'linear-delivery': webhookId,
      'linear-signature': webhookSignature,
      'linear-timestamp': webhookTimestamp,
    }

    const verifiedPayload = wh.verify(rawBody, verificationHeaders)

    const data = JSON.parse(rawBody)

    const job = await payload.jobs.queue({
      task: 'handleLinearWebhook',
      input: { payload: data },
    })

    console.log('Linear webhook received, job queued:', { job })
    waitUntil(payload.jobs.runByID({ id: job.id }))

    return { success: true, data }
  } catch (err) {
    console.error('Linear webhook verification failed:', err)
    return new Response('Webhook processing failed', { status: 401 })
  }
})
