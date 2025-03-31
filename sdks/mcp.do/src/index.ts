/**
 * MCP.do SDK
 * Multi-Cloud Platform interface for AI Primitives
 */
import { API } from 'apis.do'

export interface MCPOptions {
  region?: string
  provider?: string
  apiKey?: string
}

export interface MCPResponse {
  success: boolean
  data?: any
  error?: string
}

/**
 * Deploy a function to the Multi-Cloud Platform
 * @param functionId The ID of the function to deploy
 * @param options Configuration options
 * @returns Deployment response
 */
export async function deployFunction(functionId: string, options: MCPOptions = {}): Promise<MCPResponse> {
  const api = new API({
    apiKey: options.apiKey
  })
  
  return api.post('/mcp/deploy', {
    functionId,
    region: options.region,
    provider: options.provider
  })
}

export default {
  deployFunction,
}
