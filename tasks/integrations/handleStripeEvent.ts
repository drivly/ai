import { sendSlackAlert } from '@/lib/auth/actions/slack.action'
import { getKeyDetails, updateKeyDetails } from '@/lib/openrouter'
import { Apikey } from '@/payload.types'
import { Payload, PayloadRequest, RunInlineTaskFunction, RunningJob, WorkflowConfig } from 'payload'
import { Stripe } from 'stripe'

export const handleStripeEvent = {
  slug: 'handleStripeEvent',
  label: 'Handle Stripe Event',
  inputSchema: [
    {
      name: 'event',
      type: 'json',
      required: true,
    },
  ],
  handler: async ({ job, req, inlineTask }: { job: RunningJob<'handleStripeEvent'>; req: PayloadRequest; inlineTask: RunInlineTaskFunction }) => {
    const { payload }: { payload: Payload } = req
    const event = job.input.event as unknown as Stripe.Event
    let user: string | null | undefined = ''
    if (event.type === 'checkout.session.completed') {
      const { customer_details, amount_total } = event.data.object as Stripe.Checkout.Session
      if (customer_details?.email) user = customer_details.email
      const {
        docs: [key],
      } = await inlineTask('findKey', {
        task: async () => {
          return {
            output: await payload.db.find<Apikey>({
              collection: 'apikeys',
              where: {
                email: {
                  equals: user,
                },
                hash: {
                  exists: true,
                },
              },
            }),
          }
        },
      })

      if (key?.hash && amount_total) {
        let details = await getKeyDetails(key.hash)
        details = await updateKeyDetails(key.hash, { limit: (details.limit || 0) + amount_total / 100 })
        await inlineTask('sendSlackAlert', {
          task: async () => {
            return {
              output: {
                success: await sendSlackAlert('signups', {
                  Name: customer_details?.name || customer_details?.email,
                  Amount: amount_total / 100,
                  Phone: customer_details?.phone || 'unknown',
                  Email: customer_details?.email,
                  Address:
                    `${customer_details?.address?.line1} ${customer_details?.address?.line2} ${customer_details?.address?.city} ${customer_details?.address?.state} ${customer_details?.address?.postal_code} ${customer_details?.address?.country}`
                      .replaceAll(/ +/g, ' ')
                      .trim() || 'unknown',
                }),
              },
            }
          },
        })
      }
    } else if ('billing_details' in event.data.object) {
      user = (event.data.object as Stripe.Charge).billing_details.email || ''
    } else if ('email' in event.data.object) {
      user = (event.data.object as Stripe.Customer).email || ''
    }
    await inlineTask('createEvent', {
      task: async () => {
        const {
          type,
          data: { object: data },
          ...metadata
        } = event
        return {
          output: await payload.db.create({
            collection: 'events',
            data: {
              source: 'stripe',
              type,
              data,
              metadata: {
                ...metadata,
                user,
              },
            },
          }),
        }
      },
    })
  },
} as WorkflowConfig<'handleStripeEvent'>
