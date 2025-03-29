import { ApiClient } from './api-client'

export interface EvalConfig {
  name: string
  description?: string
  metrics?: string[]
  criteria?: Record<string, any>
  [key: string]: any
}

export interface EvalResult {
  id: string
  score: number
  metrics: Record<string, number>
  details?: any
  [key: string]: any
}

export class EvalsClient {
  private api: ApiClient

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://evals.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  async evaluateFunction(functionId: string, input: any, expected?: any): Promise<EvalResult> {
    return this.api.post(`/api/evals/functions/${functionId}`, {
      input,
      expected,
    })
  }

  async evaluateWorkflow(workflowId: string, event: any, expected?: any): Promise<EvalResult> {
    return this.api.post(`/api/evals/workflows/${workflowId}`, {
      event,
      expected,
    })
  }

  async evaluateAgent(agentId: string, question: string, expected?: any): Promise<EvalResult> {
    return this.api.post(`/api/evals/agents/${agentId}`, {
      question,
      expected,
    })
  }

  async createEval(evalConfig: EvalConfig): Promise<any> {
    return this.api.post('/api/evals', evalConfig)
  }

  async listEvals(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.list('evals', params)
  }

  async getEval(evalId: string): Promise<any> {
    return this.api.getById('evals', evalId)
  }
}

export default EvalsClient
