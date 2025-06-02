import { type Generation, getGeneration } from '@/lib/openrouter'
import type { GenerateObjectResult, GenerateTextResult, JSONValue, StepResult, StreamObjectOnFinishCallback, ToolSet } from 'ai'
import type { Payload, PayloadRequest, RunInlineTaskFunction, RunningJob, WorkflowConfig } from 'payload'

export const recordEvent = {
  slug: 'recordEvent',
  label: 'Record LLM Usage Event',
  inputSchema: [
    {
      name: 'result',
      type: 'json',
      required: true,
    },
    {
      name: 'user',
      type: 'text',
      required: true,
    },
    {
      name: 'apiKey',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, req, inlineTask, tasks }) => {
    const { payload }: { payload: Payload } = req
    const {
      result: res,
      user,
      apiKey,
    }: {
      result: unknown
      apiKey: string
      user: string
    } = job.input
    const result = res as (
      | GenerateTextResult<ToolSet, unknown>
      | GenerateObjectResult<JSONValue>
      | StepResult<ToolSet>
      | Parameters<StreamObjectOnFinishCallback<JSONValue>>[0]
    ) & {
      id?: string
      provider?: {
        pricing?: {
          prompt?: string
          completion?: string
          image?: string
          request?: string
          inputCacheRead?: string
          webSearch?: string
          internalReasoning?: string
          discount?: number
        }
        inputCost?: number
        outputCost?: number
      }
    }

    const generationTask = inlineTask('getGeneration', {
      task: async () => {
        return {
          output: await getGeneration(result.response.id, apiKey),
        }
      },
    }).then((response: Generation) =>
      tasks.createRecord('createGeneration', {
        input: {
          collection: 'generations',
          data: {
            response,
            tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Default project ID (Do More Work tenant)
          },
        },
      }),
    )

    const eventTask = tasks.createRecord('createEvent', {
      input: {
        collection: 'events',
        data: {
          type: 'llm.usage',
          source: 'llm.do',
          data: {
            id: result.id || result.response.id,
            usage: result.usage,
          },
          metadata: {
            user,
            inputCost: result.provider?.inputCost,
            outputCost: result.provider?.outputCost,
            pricing: result.provider?.pricing,
          },
          tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Default project ID (Do More Work tenant)
        },
      },
    })

    const [{ record: eventRecord }, { record: generationRecord }] = await Promise.all([eventTask, generationTask])
    await inlineTask('updateEvent', {
      task: async () => {
        return {
          output: payload.update({
            collection: 'events',
            id: (eventRecord as { id: string }).id,
            data: {
              generations: [(generationRecord as { id: string }).id],
            },
          }),
        }
      },
    })
  },
} as WorkflowConfig<'recordEvent'>
