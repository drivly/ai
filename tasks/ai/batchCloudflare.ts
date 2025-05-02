import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const processBatchCloudflare = async ({ input, req, payload }: any) => {
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
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/batch/${batch.providerBatchId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN || ''}`,
          'Content-Type': 'application/json',
        },
      })

      const batchStatus = await response.json()

      const status =
        batchStatus.success && batchStatus.result.status === 'completed' ? 'completed' : batchStatus.success && batchStatus.result.status === 'failed' ? 'failed' : 'processing'

      await payload.update({
        collection: 'generation-batches',
        id: batchId,
        data: {
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        },
      })

      if (status === 'completed' && batchStatus.result.output_url) {
      }

      return { status, batchStatus }
    }

    const batchConfig = batch.batchConfig || {}
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/batch`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchConfig),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(`Failed to create Cloudflare batch: ${JSON.stringify(result.errors)}`)
    }

    await payload.update({
      collection: 'generation-batches',
      id: batchId,
      data: {
        providerBatchId: result.result.id,
        status: 'processing',
        startedAt: new Date().toISOString(),
      },
    })

    waitUntil(
      payload.jobs.queue({
        task: 'processBatchCloudflare',
        input: {
          batchId,
          checkStatus: true,
        },
      }),
    )

    return { success: true, batchId: result.result.id }
  } catch (error: any) {
    console.error('Error processing Cloudflare batch:', error)
    return { error: error.message || 'Unknown error' }
  }
}

export const processBatchCloudflareTask = {
  slug: 'processBatchCloudflare',
  label: 'Process Cloudflare Workers AI Batch',
  inputSchema: [
    { name: 'batchId', type: 'text', required: true },
    { name: 'checkStatus', type: 'checkbox' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'error', type: 'text' },
    { name: 'batchStatus', type: 'json' },
  ],
  handler: processBatchCloudflare,
} as unknown as TaskConfig
