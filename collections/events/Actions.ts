import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'

export const Actions: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Events',
    useAsTitle: 'verb',
    // useAsTitle: 'function',
  },
  versions: true,
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'things' },
    // { name: 'verb', type: 'relationship', relationTo: ['verbs', 'functions'] }, // TODO: Figure out how this connects to Functions
    { name: 'verb', type: 'relationship', relationTo: 'verbs' },
    { name: 'function', type: 'relationship', relationTo: 'functions' },
    { name: 'object', type: 'relationship', relationTo: 'things' },
    // { name: 'input', type: 'relationship', relationTo: 'resources' },
    // { name: 'function', type: 'relationship', relationTo: 'functions' },
    // { name: 'output', type: 'relationship', relationTo: 'resources' },
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
                // timeout: doc.verb?.timeout,
                // seeds: doc.verb?.seeds,
                // callback: doc.verb?.callback,
                // type: 'Object'
                // type: doc.verb?.type,
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
