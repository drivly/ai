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
  const dateHeader = request.headers.get('date')

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
    if (dateHeader) {
      console.log('Linear webhook timestamp header is missing, using date header instead')
    } else {
      console.log('Linear webhook timestamp header and date header are missing, verification will likely fail')
    }
  }

  const rawBody = await request.text()

  try {
    const wh = new Webhook(secret)

    const webhookTimestampValue = webhookTimestamp || 
      (dateHeader ? Math.floor(new Date(dateHeader).getTime() / 1000).toString() : null)

    const verificationHeaders: Record<string, string> = {
      'linear-delivery': webhookId,
      'linear-signature': webhookSignature,
    }
    
    if (webhookTimestampValue) {
      verificationHeaders['linear-signature-timestamp'] = webhookTimestampValue
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
    console.error('Linear webhook verification failed:', err, {
      hasTimestampHeader: Boolean(webhookTimestamp),
      hasDateHeader: Boolean(dateHeader),
      timestampValue: webhookTimestamp || (dateHeader ? Math.floor(new Date(dateHeader).getTime() / 1000).toString() : null),
    })
    return new Response('Webhook processing failed', { status: 401 })
  }
})
