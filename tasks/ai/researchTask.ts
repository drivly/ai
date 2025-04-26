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

  const { topic, depth, sources, format, taskId, callback, slackChannel, slackThreadTs, slackResponseTs } = input // Destructure input

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
        slackChannel, // Pass through Slack channel if present
        slackThreadTs, // Pass through Slack thread timestamp if present
        slackResponseTs, // Pass through Slack response timestamp if present
      },
    })

    console.log(`Queued executeFunction job ${createdJob.id} for research task ${taskId}`)

    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: {
        status: 'processing',
        jobID: createdJob.id, // Store the executeFunction job ID
        slackChannel, // Store Slack channel if present
        slackThreadTs, // Store Slack thread timestamp if present
        slackResponseTs, // Store Slack response timestamp if present
      },
    })

    console.log(`Research task ${taskId} queued executeFunction job ${createdJob.id}. Waiting for results via saveExecutionResults.`)

    if (slackChannel && slackResponseTs) {
      console.log(`Will send results back to Slack channel ${slackChannel} for message ${slackResponseTs}`)
    }

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

    if (slackChannel && slackResponseTs) {
      try {
        await payload.jobs.queue({
          task: 'updateSlackMessage',
          input: {
            response_url: `https://slack.com/api/chat.update?channel=${slackChannel}&ts=${slackResponseTs}`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:x: Sorry, I encountered an error while processing your research request: ${error instanceof Error ? error.message : String(error)}`,
                },
              },
            ],
            text: 'Error processing research request',
            replace_original: true,
          },
        })
      } catch (slackError) {
        console.error('Error sending error message to Slack:', slackError)
      }
    }

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
