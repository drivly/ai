import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

/**
 * Creates a generation batch and schedules the appropriate provider-specific batch processing task
 */
export const createGenerationBatch = async ({ input, req, payload }: any) => {
  const { name, provider, batchConfig, generations = [] } = input

  try {
    const batch = await payload.create({
      collection: 'generation-batches',
      data: {
        name,
        provider,
        batchConfig,
        status: 'queued',
      },
    })

    if (generations.length > 0) {
      for (const genData of generations) {
        await payload.create({
          collection: 'generations',
          data: {
            ...genData,
            processingMode: 'batch',
            batch: batch.id,
            status: 'queued',
          },
        })
      }
    }

    let taskSlug = ''
    switch (provider) {
      case 'openai':
        taskSlug = 'processBatchOpenAI'
        break
      case 'anthropic':
        taskSlug = 'processBatchAnthropic'
        break
      case 'google':
        taskSlug = 'processBatchGoogleVertexAI'
        break
      case 'parasail':
        taskSlug = 'processBatchParasail'
        break
      case 'cloudflare':
        taskSlug = 'processBatchCloudflare'
        break
      case 'groq':
        taskSlug = 'processBatchGroq'
        break
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    const job = await payload.jobs.queue({
      task: taskSlug,
      input: {
        batchId: batch.id,
      },
    })

    waitUntil(payload.jobs.runByID({ id: job.id }))

    return {
      success: true,
      batchId: batch.id,
      jobId: job.id,
    }
  } catch (error: any) {
    console.error('Error creating generation batch:', error)
    return { error: error.message || 'Unknown error' }
  }
}

export const createGenerationBatchTask = {
  slug: 'createGenerationBatch',
  label: 'Create Generation Batch',
  inputSchema: [
    { name: 'name', type: 'text', required: true },
    { name: 'provider', type: 'text', required: true },
    { name: 'batchConfig', type: 'json', required: true },
    { name: 'generations', type: 'json' },
  ],
  outputSchema: [
    { name: 'success', type: 'checkbox' },
    { name: 'batchId', type: 'text' },
    { name: 'jobId', type: 'text' },
    { name: 'error', type: 'text' },
  ],
  handler: createGenerationBatch,
} as unknown as TaskConfig
