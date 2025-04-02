import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const processBatchAnthropic = async ({ input, req, payload }: any) => {
  const { batchId, checkStatus } = input

  try {
    const batch = await payload.findByID({
      collection: 'generation-batches',
      id: batchId,
    })

    if (!batch) {
      throw new Error(`Batch with ID ${batchId} not found`)
    }

    if (checkStatus && batch.providerBatchId) {
      const response = await fetch(`https://api.anthropic.com/v1/batches/${batch.providerBatchId}`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
      } as RequestInit)

      const batchStatus = await response.json()

      const status = batchStatus.status === 'completed' ? 'completed' : batchStatus.status === 'failed' ? 'failed' : 'processing'

      await payload.update({
        collection: 'generation-batches',
        id: batchId,
        data: {
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        },
      })

      if (status === 'completed' && batchStatus.outputs) {
      }

      return { status, batchStatus }
    }

    const batchConfig = batch.batchConfig || {}
    const response = await fetch('https://api.anthropic.com/v1/batches', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(batchConfig),
    })

    const result = await response.json()

    await payload.update({
      collection: 'generation-batches',
      id: batchId,
      data: {
        providerBatchId: result.id,
        status: 'processing',
        startedAt: new Date().toISOString(),
      },
    })

    waitUntil(
      payload.jobs.queue({
        task: 'processBatchAnthropic',
        input: {
          batchId,
          checkStatus: true,
        },
      }),
    )

    return { success: true, batchId: result.id }
  } catch (error: any) {
    console.error('Error processing Anthropic batch:', error)
    return { error: error.message || 'Unknown error' }
  }
}

export const processBatchAnthropicTask = {
  slug: 'processBatchAnthropic',
  label: 'Process Anthropic Batch',
  inputSchema: [
    { name: 'batchId', type: 'text', required: true },
    { name: 'checkStatus', type: 'checkbox' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'error', type: 'text' },
    { name: 'batchStatus', type: 'json' },
  ],
  handler: processBatchAnthropic,
} as unknown as TaskConfig
