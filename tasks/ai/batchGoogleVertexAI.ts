import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const processBatchGoogleVertexAI = async ({ input, req, payload }: any) => {
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
      const response = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/batchPredictionJobs/${batch.providerBatchId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.GOOGLE_AUTH_TOKEN || ''}`,
            'Content-Type': 'application/json',
          },
        } as RequestInit,
      )

      const batchStatus = await response.json()

      const status = batchStatus.state === 'JOB_STATE_SUCCEEDED' ? 'completed' : batchStatus.state === 'JOB_STATE_FAILED' ? 'failed' : 'processing'

      await payload.update({
        collection: 'generation-batches',
        id: batchId,
        data: {
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        },
      })

      if (status === 'completed' && batchStatus.outputInfo) {
      }

      return { status, batchStatus }
    }

    const batchConfig = batch.batchConfig || {}
    const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/batchPredictionJobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_AUTH_TOKEN || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchConfig),
    } as RequestInit)

    const result = await response.json()

    await payload.update({
      collection: 'generation-batches',
      id: batchId,
      data: {
        providerBatchId: result.name.split('/').pop(),
        status: 'processing',
        startedAt: new Date().toISOString(),
      },
    })

    waitUntil(
      payload.jobs.queue({
        task: 'processBatchGoogleVertexAI',
        input: {
          batchId,
          checkStatus: true,
        },
      }),
    )

    return { success: true, batchId: result.name }
  } catch (error: any) {
    console.error('Error processing Google Vertex AI batch:', error)
    return { error: error.message || 'Unknown error' }
  }
}

export const processBatchGoogleVertexAITask = {
  slug: 'processBatchGoogleVertexAI',
  label: 'Process Google Vertex AI Batch',
  inputSchema: [
    { name: 'batchId', type: 'text', required: true },
    { name: 'checkStatus', type: 'checkbox' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'error', type: 'text' },
    { name: 'batchStatus', type: 'json' },
  ],
  handler: processBatchGoogleVertexAI,
} as unknown as TaskConfig
