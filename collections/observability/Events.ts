import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Observability',
    useAsTitle: 'type',
    description: 'Records of all significant occurrences within the platform',
  },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'type', type: 'text' },
    { name: 'source', type: 'text' },
    { name: 'subject', type: 'relationship', relationTo: 'resources' },
    { name: 'data', type: 'json' },
    { name: 'metadata', type: 'json' },

    { name: 'action', type: 'relationship', relationTo: 'actions' },
    { name: 'trigger', type: 'relationship', relationTo: 'triggers' },
    { name: 'search', type: 'relationship', relationTo: 'searches' },
    { name: 'function', type: 'relationship', relationTo: 'functions' },
    { name: 'workflow', type: 'relationship', relationTo: 'workflows' },
    { name: 'agent', type: 'relationship', relationTo: 'agents' },

    { name: 'generations', type: 'relationship', relationTo: 'generations', hasMany: true },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            const webhooks = await req.payload.find({
              collection: 'webhooks',
              where: {
                enabled: { equals: true },
              },
            })

            if (webhooks.docs.length > 0) {
              const { payload } = req

              for (const webhook of webhooks.docs) {
                const job = await payload.jobs.queue({
                  task: 'deliverWebhook',
                  input: {
                    event: doc,
                    webhookId: webhook.id,
                  },
                })

                console.log(`Queued webhook delivery for event ${doc.id} to webhook ${webhook.id}`, job)
                waitUntil(payload.jobs.runByID({ id: job.id }))
              }
            }
          } catch (error) {
            console.error('Error in webhook processing:', error)
          }
        }
        return doc
      },
    ],
  },
}
