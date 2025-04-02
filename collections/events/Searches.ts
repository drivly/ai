import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'

export const Searches: CollectionConfig = {
  slug: 'searches',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'query', type: 'text' },
    {
      name: 'searchType',
      type: 'select',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Vector', value: 'vector' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      defaultValue: 'text',
    },
    { name: 'results', type: 'json', admin: { readOnly: true } },
    { name: 'embedding', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.searchType === 'vector' || data.searchType === 'hybrid') {
          try {
            const { payload } = req

            const job = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: 'generateEmbedding',
                args: { query: data.query },
              },
            })

            console.log(`Queued embedding generation for search query: ${data.query}`, job)
            waitUntil(payload.jobs.runByID({ id: job.id }))
          } catch (error) {
            console.error('Error queueing embedding generation for search:', error)
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        try {
          const { payload } = req

          if (doc.searchType === 'vector') {
            const job = await payload.jobs.queue({
              task: 'searchThings',
              input: {
                query: doc.query,
                limit: 10,
              },
            })

            console.log(`Queued vector search for: ${doc.query}`, job)
            waitUntil(payload.jobs.runByID({ id: job.id }))
          } else if (doc.searchType === 'hybrid') {
            const job = await payload.jobs.queue({
              task: 'hybridSearchThings',
              input: {
                query: doc.query,
                limit: 10,
              },
            })

            console.log(`Queued hybrid search for: ${doc.query}`, job)
            waitUntil(payload.jobs.runByID({ id: job.id }))
          }
        } catch (error) {
          console.error('Error queueing search task:', error)
        }

        return doc
      },
    ],
  },
}
