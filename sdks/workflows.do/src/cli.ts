import { CLI as BaseCLI, CliOptions } from '../../../sdks/apis.do/src/cli.js'
import { API } from './client.js'

export type { CliOptions }

export class CLI extends BaseCLI {
  private workflowsApi: API

  constructor(options: CliOptions = {}) {
    super(options)
    this.workflowsApi = new API({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
    })
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input: Record<string, any>, options: any = {}): Promise<any> {
    console.log(`Executing workflow ${workflowId}...`)
    return this.workflowsApi.executeWorkflow(workflowId, input, options)
  }

  /**
   * Register a workflow
   */
  async registerWorkflow(workflowDefinition: any): Promise<any> {
    console.log('Registering workflow...')
    return this.workflowsApi.registerWorkflow(workflowDefinition)
  }
}
