import { executeFunction } from '@/tasks/ai/executeFunction'
import { createOpenAI } from '@ai-sdk/openai'

type StringArray = Array<string>
type SchemaValue = string | number | StringArray | { [key: string]: SchemaValue } | SchemaValue[]
type FunctionDefinition = Record<string, SchemaValue>

export type SchemaToOutput<T extends FunctionDefinition> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K] extends Array<string>
      ? string[]
      : T[K] extends Array<Record<string, any>>
        ? Array<{ [P in keyof T[K][0]]: SchemaToOutput<{ value: T[K][0][P] }>['value'] }>
        : string[]
    : T[K] extends Record<string, any>
      ? { [P in keyof T[K]]: SchemaToOutput<{ value: T[K][P] }>['value'] }
      : string
}

type AIFunctionSettings = {
  _model?: string
  _temperature?: number
  _maxTokens?: number
  _topP?: number
  _topK?: number
}

type AIFunctionProperty = string | string[] | Record<string, string> | Record<string, string[]>
type AIFunction<TInput = any, TOutput = any> = (input: TInput) => Promise<TOutput>
type AIWorkflow = (args: any) => Promise<any> // TODO: Get this strongly typed with generics on ai and db

type AIConfig = AIFunctionSettings & {
  [key: string]: FunctionDefinition | AIWorkflow | AIFunction | string | number
}

export const AI = <T extends Record<string, FunctionDefinition | AIWorkflow>>(config: AIConfig) => {
  type Result = {
    [K in keyof T]: T[K] extends FunctionDefinition 
      ? (args: any) => Promise<SchemaToOutput<T[K]>> 
      : T[K] extends AIWorkflow 
        ? AIWorkflow 
        : never
  }

  return new Proxy(
    {} as any,
    {
      get: (target: any, functionName: string) => {
        if (config[functionName]) {
          if (typeof config[functionName] === 'function') {
            return config[functionName]
          }
          
          // Strip out _* properties
          const schema = Object.fromEntries(Object.entries(config[functionName] as Record<string, any>).filter(([key]) => !key.startsWith('_')))
          const settings = Object.fromEntries(Object.entries(config[functionName] as Record<string, any>).filter(([key]) => key.startsWith('_')))
          // TODO: if functionName is a workflow, call it directly wrapped in try/catch, and maybe queued in a job
          
          return async (args: any) => {
            if (!functionName) {
              console.error('Missing functionName in AI function call')
              throw new Error('Invalid function call: missing functionName')
            }

            const result = await executeFunction({ functionName, schema, settings, args })
            return result.output as SchemaToOutput<typeof schema>
          }
        }
        throw new Error(`Function ${functionName} not found in AI config`)
      },
    },
  ) as Result
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
