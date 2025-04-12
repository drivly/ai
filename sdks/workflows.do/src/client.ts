import { API as BaseAPI } from 'apis.do/src/client'
import type { ClientOptions } from 'apis.do/types'

export class API extends BaseAPI {
  constructor(options: ClientOptions = {}) {
    super(options)
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input: Record<string, any>, options?: any): Promise<any> {
    return this.post(`/v1/workflows/${workflowId}/execute`, { input, options })
  }

  /**
   * Register a workflow
   */
  async registerWorkflow(workflow: any): Promise<any> {
    return this.post('/v1/workflows/register', { workflow })
  }
}
