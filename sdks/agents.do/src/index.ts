import { ApiClient } from './api'
import { Agent as CloudflareAgent, AgentNamespace } from 'agents'
import type { 
  AgentConfig, 
  AgentResponse, 
  AgentClientOptions, 
  AgentExecutionOptions, 
  AgentExecutionResult 
} from '../types'

export * from '../types'

export type { AgentNamespace } from 'agents'

export class Agent<Env = any, State = any> extends CloudflareAgent<Env, State> {
  constructor(config: any, state: any = {}) {
    super(config, state)
  }
}

export function openai(model: string) {
  return `openai/${model}`
}

export function anthropic(model: string) {
  return `anthropic/${model}`
}

export class AgentsClient {
  private api: ApiClient
  private defaultConfig?: Partial<AgentConfig>

  constructor(options: AgentClientOptions = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://agents.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
    this.defaultConfig = options.defaultConfig
  }

  async ask<T = any>(agentId: string, question: string, context?: any): Promise<AgentResponse<T>> {
    return this.api.post(`/api/agents/${agentId}/ask`, {
      question,
      context,
    })
  }

  async execute<T = any>(
    agentId: string, 
    input: Record<string, any>, 
    options?: AgentExecutionOptions
  ): Promise<AgentExecutionResult> {
    return this.api.post(`/api/agents/${agentId}/execute`, {
      input,
      options,
    })
  }

  async create(agentConfig: AgentConfig): Promise<any> {
    const config = {
      ...this.defaultConfig,
      ...agentConfig,
    }
    return this.api.post('/api/agents', config)
  }

  async list(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.list('agents', params)
  }

  async get(agentId: string): Promise<any> {
    return this.api.getById('agents', agentId)
  }

  async update(agentId: string, data: Partial<AgentConfig>): Promise<any> {
    return this.api.update('agents', agentId, data)
  }

  async delete(agentId: string): Promise<any> {
    return this.api.remove('agents', agentId)
  }
}

export default AgentsClient
