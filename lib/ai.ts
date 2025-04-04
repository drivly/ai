import { executeFunction } from '@/tasks/ai/executeFunction'

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
          return (args: any) =>
            executeFunction({ functionName, schema, settings, args }).catch((error) => {
              console.error(`Error executing function ${functionName}:`, error)
              // TODO: log error in db ... maybe also create a task to retry
              throw error
            })
        }
        throw new Error(`Function ${functionName} not found in AI config`)
      },
    },
  )
}
