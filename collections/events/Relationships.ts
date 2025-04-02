import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'

export const Relationships: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Events',
    useAsTitle: 'verb',
  },
  versions: true,
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'resources' },
    { name: 'verb', type: 'relationship', relationTo: 'verbs' },
    { name: 'object', type: 'relationship', relationTo: 'resources' },
    { name: 'hash', type: 'text' },
    { name: 'generation', type: 'join', collection: 'generations', on: 'action' },
  ],
  hooks: {
    afterChange: [
      async (ctx) => {
        const {
          doc,
          operation,
          req: { payload },
        } = ctx
        if (operation === 'create') {
          console.log('Queueing function execution', doc)
          if (!doc.object) {
            const job = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: doc.function?.functionName,
                args: doc.subject?.data,
                schema: doc.function?.schema,
              },
            })
            console.log('Queued function execution', job)
            waitUntil(payload.jobs.runByID({ id: job.id }))
          }
        }
      },
    ],
  },
}
