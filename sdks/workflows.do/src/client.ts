import { ApiClient } from './api-client'
import { WorkflowConfig, WorkflowContext } from './index'

export interface WorkflowsClientOptions {
  apiKey?: string
  baseUrl?: string
}

export class WorkflowsClient {
  private api: ApiClient

  constructor(options: WorkflowsClientOptions = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://workflows.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  async trigger(workflowId: string, event: any): Promise<any> {
    return this.api.post(`/api/workflows/${workflowId}/trigger`, { event })
  }

  async create(workflow: WorkflowConfig): Promise<any> {
    return this.api.post('/api/workflows', workflow)
  }

  async list(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.list('workflows', params)
  }

  async get(workflowId: string): Promise<any> {
    return this.api.getById('workflows', workflowId)
  }

  async update(workflowId: string, data: Partial<WorkflowConfig>): Promise<any> {
    return this.api.update('workflows', workflowId, data)
  }

  async delete(workflowId: string): Promise<any> {
    return this.api.remove('workflows', workflowId)
  }

  async getExecutions(workflowId: string, params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.get(`/api/workflows/${workflowId}/executions`, params)
  }

  async getExecution(workflowId: string, executionId: string): Promise<any> {
    return this.api.get(`/api/workflows/${workflowId}/executions/${executionId}`)
  }
}

export default WorkflowsClient
