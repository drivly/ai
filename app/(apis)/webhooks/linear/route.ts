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
  const webhookTimestamp = request.headers.get('linear-signature-timestamp')
  const webhookSignature = request.headers.get('linear-signature')

  if (!webhookId || !webhookSignature) {
    console.error('Missing required Linear webhook headers', {
      headers: Object.fromEntries([...request.headers.entries()]),
      hasBody: Boolean(await request.clone().text()),
      requestUrl: request.url,
      method: request.method,
      contentType: request.headers.get('content-type'),
    })
    return new Response('Missing required webhook headers', { status: 400 })
  }
  
  if (!webhookTimestamp) {
    console.log('Linear webhook timestamp header is missing, using current timestamp')
  }

  const rawBody = await request.text()

  try {
    const wh = new Webhook(secret)
    
    const currentTimestamp = webhookTimestamp || Math.floor(Date.now() / 1000).toString()
    
    const verifiedPayload = wh.verify(rawBody, {
      'linear-delivery': webhookId,
      'linear-signature-timestamp': currentTimestamp,
      'linear-signature': webhookSignature,
    })

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
