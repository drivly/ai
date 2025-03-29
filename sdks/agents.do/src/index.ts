import { ApiClient } from './api-client'

export interface AgentConfig {
  name: string
  description?: string
  functions?: string[]
  workflows?: string[]
  tools?: string[]
  systemPrompt?: string
  baseModel?: string
  [key: string]: any
}

export interface AgentResponse<T = any> {
  data: T
  meta?: {
    duration?: number
    [key: string]: any
  }
}

export class AgentsClient {
  private api: ApiClient

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://agents.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  async ask<T = any>(agentId: string, question: string, context?: any): Promise<AgentResponse<T>> {
    return this.api.post(`/api/agents/${agentId}/ask`, {
      question,
      context,
    })
  }

  async create(agentConfig: AgentConfig): Promise<any> {
    return this.api.post('/api/agents', agentConfig)
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
