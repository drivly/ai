// Define our own types since GenerateObjectOptions is not exported from 'ai'
export interface AIFunctionOptions {
  model?: string | any
  temperature?: number
  maxTokens?: number
  schema?: any
  output?: 'array' | 'enum' | 'no-schema'
  [key: string]: any
}

export interface AIFunctionConfig {
  model?: string | any
  temperature?: number
  maxTokens?: number
  [key: string]: any
}
