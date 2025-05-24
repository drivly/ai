import { getKeyDetails, updateKeyDetails } from '@/lib/openrouter'
import { Apikey } from '@/payload.types'
import { WorkflowConfig } from 'payload'
import { Payload } from 'payload'

export const handleStripeEvent = {
  slug: 'handleStripeEvent',
  label: 'Handle Stripe Event',
  handler: async ({ job, tasks, req, inlineTask }: any) => {
    const { payload }: { payload: Payload } = req
    const { event } = job.input

    await payload.db.create({
      collection: 'events',
      data: {
        source: 'stripe',
        type: event.type,
        metadata: event.data.object,
      },
    })
    if (event.type === 'checkout.session.completed') {
      const { customer_details, amount_total } = event.data.object
      const {
        docs: [key],
      } = await payload.db.find<Apikey>({
        collection: 'apikeys',
        where: {
          email: {
            equals: customer_details?.email,
          },
          hash: {
            exists: true,
          },
        },
      })
      if (key?.hash) {
        let details = await getKeyDetails(key.hash)
        details = await updateKeyDetails(key.hash, { limit: (details.limit || 0) + amount_total / 100 })
      }
    } else {
      console.log(event.type, JSON.stringify(event.data.object, null, 2))
    }
  },
} as WorkflowConfig<'handleStripeEvent'>
