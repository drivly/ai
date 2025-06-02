import type { CollectionSlug, TaskConfig } from 'payload'

export const createRecordTask = {
  slug: 'createRecord',
  label: 'Create Record',
  inputSchema: [
    { name: 'collection', type: 'text', required: true },
    { name: 'data', type: 'json', required: true },
  ],
  outputSchema: [{ name: 'record', type: 'json', required: true }],
  handler: async ({ input, req }) => {
    const { payload } = req
    const { data, collection } = input
    const record = await payload.create({
      collection: collection as CollectionSlug,
      data: data as Record<string, unknown>,
      req,
    })
    return { output: { record: record as unknown as Record<string, unknown> } }
  },
} as TaskConfig<'createRecord'>
