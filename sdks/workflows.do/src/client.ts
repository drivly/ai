import { API as BaseAPI, ClientOptions } from '../../apis.do/src/client.js'

export class API extends BaseAPI {
  constructor(options: ClientOptions = {}) {
    super(options)
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input: Record<string, any>, options?: any): Promise<any> {
    return this.post(`/api/workflows/${workflowId}/execute`, { input, options })
  }

  /**
   * Register a workflow
   */
  async registerWorkflow(workflow: any): Promise<any> {
    return this.post('/api/workflows/register', { workflow })
  }
}
