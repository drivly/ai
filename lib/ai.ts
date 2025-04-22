import { executeFunction } from '@/tasks/ai/executeFunction'
import { createOpenAI } from '@ai-sdk/openai'

type AIFunctionSettings = {
  _model?: string
  _temperature?: number
  _maxTokens?: number
  _topP?: number
  _topK?: number
}

type AIFunctionProperty = string | string[] | Record<string, string> | Record<string, string[]>
type AIFunction = Record<string, AIFunctionProperty>
type AIWorkflow = (args: any) => Promise<any> // TODO: Get this strongly typed with generics on ai and db

type AIConfig = AIFunctionSettings & {
  [key: string]: AIFunction | AIWorkflow
}

export const AI = (config: AIConfig) => {
  return new Proxy(
    {},
    {
      get: (target: any, functionName: string) => {
        if (config[functionName]) {
          // Strip out _* properties
          const schema = Object.fromEntries(Object.entries(config[functionName]).filter(([key]) => !key.startsWith('_')))
          const settings = Object.fromEntries(Object.entries(config[functionName]).filter(([key]) => key.startsWith('_')))
          // TODO: if functionName is a workflow, call it directly wrapped in try/catch, and maybe queued in a job
          return (args: any) => {
            if (!functionName) {
              console.error('Missing functionName in AI function call')
              throw new Error('Invalid function call: missing functionName')
            }

            return executeFunction({ functionName, schema, settings, args }).catch((error) => {
              console.error(`Error executing function ${functionName}:`, error)
              // TODO: log error in db ... maybe also create a task to retry
              throw error
            })
          }
        }
        throw new Error(`Function ${functionName} not found in AI config`)
      },
    },
  )
}

export const model = createOpenAI({
  compatibility: 'compatible',
  apiKey: process.env.AI_GATEWAY_TOKEN!,
  baseURL: process.env.AI_GATEWAY_URL!,
  headers: {
    'HTTP-Referer': 'https://workflows.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Optional. Site title for rankings on openrouter.ai.
  },
})
