/**
 * AI Models Package
 * Stub implementation to fix build errors
 */

export type Capability = 'reasoning' | 'tools' | 'code' | 'online'

export enum Provider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Google = 'google',
  Mistral = 'mistral',
  Cohere = 'cohere',
  Azure = 'azure',
  Custom = 'custom'
}

export interface ParsedModelIdentifier {
  provider: string
  model: string
  capabilities: Capability[]
  systemConfig?: {
    seed?: number
    temperature?: number
    maxTokens?: number
    topP?: number
    topK?: number
  }
}

export interface Model {
  id: string
  name: string
  provider: string
  capabilities: Capability[]
  sorting: {
    topWeekly: number
    newest: number
    throughputHighToLow: number
    latencyLowToHigh: number
    pricingLowToHigh: number
    pricingHighToLow: number
  }
  author: string
  alias?: string
  modelIdentifier?: string
  defaults?: Record<string, any>
  rawModel?: {
    endpoint?: {
      pricing: {
        prompt: number
        completion: number
      }
    }
  }
}

export const models: Model[] = []

export function getModel(modelName: string): { model: Model; parsed: ParsedModelIdentifier } | null {
  return null
}

export function reconstructModelString(parsed: ParsedModelIdentifier): string {
  return ''
}

export function parse(modelString: string): ParsedModelIdentifier {
  return {
    provider: '',
    model: '',
    capabilities: [],
  }
}

export function getModels(): Model[] {
  return models
}

export const modelPattern = ''
