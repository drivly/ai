import { Webhook } from 'svix'
import { TaskConfig } from 'payload'
import { filterEvents } from '../../src/utils/webhook-filtering'

/**
 * Function to deliver webhook events with filtering
 */
export const deliverWebhookHandler = async ({ payload, job }: { payload: any; job: any }) => {
  const { event, webhookId } = job.input

  try {
    const eventDoc = await payload.findByID({
      collection: 'events',
      id: event.id,
    })

    if (!eventDoc) {
      return { error: `Event ${event.id} not found` }
    }

    const webhook = await payload.findByID({
      collection: 'webhooks',
      id: webhookId,
    })

    if (!webhook) {
      return { error: `Webhook ${webhookId} not found` }
    }

    if (!webhook.enabled) {
      return { status: 'skipped', message: 'Webhook is disabled' }
    }

    let nounDoc = null
    let verbDoc = null

    if (eventDoc.subject) {
      const thingDoc = await payload.findByID({
        collection: 'things',
        id: eventDoc.subject,
      })

      if (thingDoc?.type) {
        nounDoc = await payload.findByID({
          collection: 'nouns',
          id: thingDoc.type,
        })
      }
    }

    if (eventDoc.action) {
      const actionDoc = await payload.findByID({
        collection: 'actions',
        id: eventDoc.action,
      })

      if (actionDoc?.verb) {
        verbDoc = await payload.findByID({
          collection: 'verbs',
          id: actionDoc.verb,
        })
      }
    }

    const eventPattern = nounDoc && verbDoc ? `${nounDoc.name}.${verbDoc.event}` : null

    if (!eventPattern) {
      return { error: 'Could not construct Noun.Verb pattern for event' }
    }

    const patterns = webhook.filters?.map((filter: any) => filter.pattern) || []

    if (!filterEvents(eventPattern, patterns)) {
      return { status: 'filtered', message: `Event ${eventPattern} did not match webhook filters` }
    }

    const secret = webhook.secret || process.env.WEBHOOK_DEFAULT_SECRET
    if (!secret) {
      return { error: 'Webhook secret not configured' }
    }

    const wh = new Webhook(secret)
    const timestamp = Date.now().toString()

    const webhookPayload = {
      id: event.id,
      type: eventPattern,
      created: new Date().toISOString(),
      data: eventDoc.data,
    }

    const signature = wh.sign(JSON.stringify(webhookPayload), new Date(parseInt(timestamp)), secret)

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'webhook-id': webhookId,
        'webhook-timestamp': timestamp,
        'webhook-signature': signature,
      },
      body: JSON.stringify(webhookPayload),
    })

    return {
      status: response.ok ? 'success' : 'failure',
      statusCode: response.status,
      message: response.ok ? 'Webhook delivered successfully' : `Failed to deliver webhook: ${response.statusText}`,
    }
  } catch (error: any) {
    console.error('Error delivering webhook:', error)
    return { error: error.message || 'Unknown error' }
  }
}

/**
 * Task to deliver webhook events with filtering
 */
export const deliverWebhookTask = {
  slug: 'deliverWebhook',
  label: 'Deliver Webhook',
  inputSchema: [
    { name: 'event', type: 'json', required: true },
    { name: 'webhookId', type: 'text', required: true },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'message', type: 'text' },
    { name: 'statusCode', type: 'number' },
  ],
  handler: deliverWebhookHandler,
} as unknown as TaskConfig
