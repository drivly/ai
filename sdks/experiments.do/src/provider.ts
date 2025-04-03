import { API } from 'apis.do'

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

export class VercelFlagsProvider {
  private api: API
  
  constructor(options: VercelFlagsProviderOptions = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://flags-api.vercel.com',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }
  
  async createFlag(flag: FlagDefinition): Promise<any> {
    return this.api.post('/api/v1/flags', flag)
  }
  
  async getFlag(flagName: string): Promise<FlagDefinition> {
    return this.api.get(`/api/v1/flags/${flagName}`)
  }
  
  async evaluateFlag(flagName: string, context: FlagContext): Promise<FlagResult> {
    return this.api.post(`/api/v1/flags/${flagName}/evaluate`, context)
  }
  
  async recordMetric(flagName: string, variant: string, metrics: Record<string, number>): Promise<any> {
    return this.api.post(`/api/v1/flags/${flagName}/metrics`, {
      variant,
      metrics,
    })
  }
  
  async getResults(flagName: string): Promise<any> {
    return this.api.get(`/api/v1/flags/${flagName}/results`)
  }
}

export default VercelFlagsProvider
