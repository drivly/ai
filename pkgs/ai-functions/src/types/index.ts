import type { GenerateObjectOptions } from 'ai'

export interface AIFunctionOptions extends Omit<GenerateObjectOptions, 'model'> {
  model?: string | GenerateObjectOptions['model']
}

export interface AIFunctionConfig {
  model?: string | GenerateObjectOptions['model']
  temperature?: number
  maxTokens?: number
  [key: string]: any
}
