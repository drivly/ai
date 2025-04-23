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
          const skipDirectEmbedding = true
          
          if (!skipDirectEmbedding) {
            const { payload } = req
  
            try {
              const embedding = { vectors: [0.1, 0.2, 0.3] } // Replace with actual embedding generation
              
              await payload.update({
                collection: 'resources',
                id: doc.id,
                data: {
                  embedding,
                },
                depth: 0,
              })
              
              console.log(`Generated embedding directly for resource ${doc.id}`)
            } catch (directError) {
              console.log(`Direct embedding generation failed for resource ${doc.id}, falling back to job queue:`, directError)
              
              const job = await payload.jobs.queue({
                task: 'generateThingEmbedding',
                input: {
                  id: doc.id,
                },
              })
              
              console.log(`Queued embedding generation for resource ${doc.id}`, job)
            }
          }
          
          return doc
        } catch (error) {
          console.error('Error generating embedding for resource:', error)
          return doc
        }
      },
    ],
  },
}
