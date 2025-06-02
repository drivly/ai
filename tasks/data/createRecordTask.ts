import type { CollectionSlug, TaskConfig } from 'payload'

export const createRecordTask = {
  slug: 'createRecord',
  label: 'Create Record',
  inputSchema: [
    { name: 'collection', type: 'text', required: true },
    { name: 'data', type: 'json', required: true },
  ],
  outputSchema: [{ name: 'record', type: 'json' }],
  handler: async ({ input, req }) => {
    const { payload } = req
    const { data, collection } = input
    const newRecord = await payload.create({
      collection: collection as CollectionSlug,
      data: data as Record<string, unknown>,
      req,
    })
    return { output: { record: newRecord } }
  },
} as TaskConfig<'createRecord'>
