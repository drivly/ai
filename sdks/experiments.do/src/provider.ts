import { API, client } from 'apis.do'

export interface OpenFeatureProvider<T = any> {
  metadata: ProviderMetadata
  initialize(): Promise<void>
  onContextChange?(oldContext: EvaluationContext, newContext: EvaluationContext): void
  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean, context: EvaluationContext): Promise<ResolutionDetails<boolean>>
  resolveStringEvaluation(flagKey: string, defaultValue: string, context: EvaluationContext): Promise<ResolutionDetails<string>>
  resolveNumberEvaluation(flagKey: string, defaultValue: number, context: EvaluationContext): Promise<ResolutionDetails<number>>
  resolveObjectEvaluation<U extends object>(flagKey: string, defaultValue: U, context: EvaluationContext): Promise<ResolutionDetails<U>>
}

export interface ProviderMetadata {
  name: string
}

export interface EvaluationContext {
  [key: string]: any
}

export interface ResolutionDetails<T> {
  value: T
  variant?: string
  reason?: string
  errorCode?: string
  errorMessage?: string
}

export interface VercelFlagsProviderOptions {
  apiKey?: string
  baseUrl?: string
}

export interface FlagDefinition {
  name: string
  description?: string
  variants: Record<string, any>
  defaultVariant: string
}

export interface FlagContext {
  userId?: string
  sessionId?: string
  [key: string]: any
}

export interface FlagResult {
  variant: string
  value: any
}

export class VercelFlagsProvider implements OpenFeatureProvider {
  private api: API

  metadata = {
    name: 'Vercel Flags Provider',
  }

  constructor(options: VercelFlagsProviderOptions = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://flags-api.vercel.com',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  async initialize(): Promise<void> {}

  async createFlag(flag: FlagDefinition): Promise<any> {
    return this.api.post('/api/v1/flags', flag)
  }

  async getFlag(flagKey: string): Promise<FlagDefinition> {
    return this.api.get(`/api/v1/flags/${flagKey}`)
  }

  async evaluateFlag(flagKey: string, context: FlagContext): Promise<FlagResult> {
    return this.api.post(`/api/v1/flags/${flagKey}/evaluate`, context)
  }

  async recordMetric(flagKey: string, variant: string, metrics: Record<string, number>): Promise<any> {
    return this.api.post(`/api/v1/flags/${flagKey}/metrics`, {
      variant,
      metrics,
    })
  }

  async getResults(flagKey: string): Promise<any> {
    return this.api.get(`/api/v1/flags/${flagKey}/results`)
  }

  async resolveBooleanEvaluation(flagKey: string, defaultValue: boolean, context: EvaluationContext): Promise<ResolutionDetails<boolean>> {
    try {
      const result = await this.evaluateFlag(flagKey, context)
      return {
        value: typeof result.value === 'boolean' ? result.value : defaultValue,
        variant: result.variant,
      }
    } catch (error: any) {
      return {
        value: defaultValue,
        errorCode: 'ERROR',
        errorMessage: error?.message || 'Unknown error',
      }
    }
  }

  async resolveStringEvaluation(flagKey: string, defaultValue: string, context: EvaluationContext): Promise<ResolutionDetails<string>> {
    try {
      const result = await this.evaluateFlag(flagKey, context)
      return {
        value: typeof result.value === 'string' ? result.value : defaultValue,
        variant: result.variant,
      }
    } catch (error: any) {
      return {
        value: defaultValue,
        errorCode: 'ERROR',
        errorMessage: error?.message || 'Unknown error',
      }
    }
  }

  async resolveNumberEvaluation(flagKey: string, defaultValue: number, context: EvaluationContext): Promise<ResolutionDetails<number>> {
    try {
      const result = await this.evaluateFlag(flagKey, context)
      return {
        value: typeof result.value === 'number' ? result.value : defaultValue,
        variant: result.variant,
      }
    } catch (error: any) {
      return {
        value: defaultValue,
        errorCode: 'ERROR',
        errorMessage: error?.message || 'Unknown error',
      }
    }
  }

  async resolveObjectEvaluation<U extends object>(flagKey: string, defaultValue: U, context: EvaluationContext): Promise<ResolutionDetails<U>> {
    try {
      const result = await this.evaluateFlag(flagKey, context)
      return {
        value: typeof result.value === 'object' ? (result.value as U) : defaultValue,
        variant: result.variant,
      }
    } catch (error: any) {
      return {
        value: defaultValue,
        errorCode: 'ERROR',
        errorMessage: error?.message || 'Unknown error',
      }
    }
  }
}

export default VercelFlagsProvider
