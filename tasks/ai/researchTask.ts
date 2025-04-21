import { TaskConfig, TaskHandler } from 'payload' // Import directly from 'payload'
import type { Payload } from 'payload'

type ResearchOutput = {
  summary?: string | null
  findings?: { finding?: string | null; id?: string | null }[] | null
  sources?: { sourceUrl?: string | null; id?: string | null }[] | null
  confidence?: number | null
}

const aiOutputSchema = {
  summary: 'string',
  findings: 'string[]',
  sources: 'string[]',
  confidence: 'number',
}

export const researchTaskHandler: TaskHandler<'researchTask'> = async ({ input, req, payload }: any): Promise<any> => {
  if (!payload) payload = req?.payload
  if (!payload) throw new Error('Payload instance not found in task arguments')

  const { topic, depth, sources, format, taskId, callback } = input // Destructure input

  try {
    const createdJob = await payload.jobs.queue({
      task: 'executeFunction',
      input: {
        functionName: 'research', // Logical name for logging/tracking
        args: { topic, depth, sources, format },
        schema: aiOutputSchema, // Pass the expected output structure
        settings: {
          model: 'perplexity/sonar-deep-research', // Specify the model
        },
        type: 'Object', // Assuming research returns a structured object
      },
    })

    console.log(`Queued executeFunction job ${createdJob.id} for research task ${taskId}`)

    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: {
        status: 'processing',
        jobID: createdJob.id, // Store the executeFunction job ID
      },
    })

    console.log(`Research task ${taskId} queued executeFunction job ${createdJob.id}. Waiting for results via saveExecutionResults.`)

    return { summary: 'Processing...', findings: [], sources: [], confidence: 0 } // Return placeholder
  } catch (error) {
    console.error(`Error processing research task ${taskId}:`, error)
    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: {
        status: 'failed',
        output: { error: error instanceof Error ? error.message : String(error) },
      },
    })
    throw error // Re-throw error for job queue handling
  }
}

export const researchTask = {
  slug: 'researchTask',
  label: 'Perform Deep Research',
  inputSchema: [
    { name: 'topic', type: 'text', required: true },
    { name: 'depth', type: 'number' },
    { name: 'sources', type: 'array', fields: [{ name: 'sourceUrl', type: 'text' }] },
    { name: 'format', type: 'text' },
    { name: 'taskId', type: 'text', required: true }, // ID of the triggering task
    { name: 'callback', type: 'json' }, // Optional callback info
  ],
  outputSchema: [
    { name: 'summary', type: 'text' },
    { name: 'findings', type: 'array', fields: [{ name: 'finding', type: 'text' }] },
    { name: 'sources', type: 'array', fields: [{ name: 'sourceUrl', type: 'text' }] },
    { name: 'confidence', type: 'number' },
  ],
  handler: researchTaskHandler,
  retries: 2, // Add retries if appropriate for research tasks
} as TaskConfig<'researchTask'> // Keep 'as' casting for now
