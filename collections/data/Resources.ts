import type { CollectionConfig } from 'payload'
import { simplerJSON } from 'payload-utils'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    group: 'Data',
    useAsTitle: 'yaml',
    description: 'Structured data resources with embeddings for semantic search',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'sqid', type: 'text', admin: { readOnly: true }, index: true },
        { name: 'hash', type: 'text', admin: { readOnly: true }, index: true },
        { name: 'type', type: 'relationship', relationTo: ['nouns', 'things'] },
      ],
    },
    ...(simplerJSON({
      jsonFieldName: 'data',
      codeFieldName: 'yaml',
      label: 'Data',
      defaultFormat: 'yaml',
      editorOptions: { padding: { top: 20, bottom: 20 } },
    }) as any),
    { name: 'embedding', type: 'json', admin: { hidden: true }, index: false },
    { name: 'subjectOf', type: 'relationship', relationTo: 'actions', hasMany: true },
    { name: 'objectOf', type: 'relationship', relationTo: 'actions', hasMany: true },
    {
      name: 'content',
      type: 'code',
      admin: {
        language: 'mdx',
        editorOptions: { padding: { top: 20, bottom: 20 } },
      },
    },
  ],
  hooks: {
    beforeOperation: [
      async (args) => {
        if (args.operation === 'create') {
        }

        if (args.operation === 'update') {
        }
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        try {
          const { payload } = req

          const job = await payload.jobs.queue({
            task: 'generateThingEmbedding',
            input: {
              id: doc.id,
            },
          })

          console.log(`Queued embedding generation for resource ${doc.id}`, job)
          await payload.jobs.runByID({ id: job.id })

          return doc
        } catch (error) {
          console.error('Error queueing generateResourceEmbedding task:', error)
          return doc
        }
      },
    ],
  },
}
