import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const processBatchGroq = async ({ input, req, payload }: any) => {
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
      const response = await fetch(`https://api.groq.com/openai/v1/batches/${batch.providerBatchId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
      })

      const batchStatus = await response.json()

      const status = batchStatus.status === 'completed' 
        ? 'completed' 
        : batchStatus.status === 'failed' || batchStatus.status === 'expired' 
          ? 'failed' 
          : 'processing'

      await payload.update({
        collection: 'generation-batches',
        id: batchId,
        data: {
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        },
      })

      if (status === 'completed' && batchStatus.output_file_id) {
      }

      return { status, batchStatus }
    }

    const batchConfig = batch.batchConfig || {}
    
    let fileId = ''
    if (batchConfig.file_content) {
      const fileResponse = await fetch('https://api.groq.com/openai/v1/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
        },
        body: (() => {
          const formData = new FormData()
          formData.append('purpose', 'batch')
          formData.append('file', new Blob([batchConfig.file_content], { type: 'application/jsonl' }), 'batch_file.jsonl')
          return formData
        })(),
      })
      
      const fileResult = await fileResponse.json()
      fileId = fileResult.id
    } else if (batchConfig.file_id) {
      fileId = batchConfig.file_id
    } else {
      throw new Error('Either file_content or file_id must be provided in batchConfig')
    }
    
    const batchParams = {
      input_file_id: fileId,
      endpoint: batchConfig.endpoint || '/v1/chat/completions',
      completion_window: batchConfig.completion_window || '24h',
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/batches', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchParams),
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
        task: 'processBatchGroq',
        input: {
          batchId,
          checkStatus: true,
        },
      }),
    )

    return { success: true, batchId: result.id }
  } catch (error: any) {
    console.error('Error processing Groq batch:', error)
    return { error: error.message || 'Unknown error' }
  }
}

export const processBatchGroqTask = {
  slug: 'processBatchGroq',
  label: 'Process Groq Batch',
  inputSchema: [
    { name: 'batchId', type: 'text', required: true },
    { name: 'checkStatus', type: 'checkbox' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'error', type: 'text' },
    { name: 'batchStatus', type: 'json' },
  ],
  handler: processBatchGroq,
} as unknown as TaskConfig
