import { API as ApiClient } from 'apis.do'

export type ModelCapability = 'code' | 'online' | 'reasoning' | 'reasoning-low' | 'reasoning-medium' | 'reasoning-high' | 'tools' | 'structuredOutput' | 'responseFormat'

export interface ModelDetails {
  name: string
  url?: string
  author?: string
  provider?: string
  capabilities?: ModelCapability[]
  defaults?: ModelCapability[]
  [key: string]: any
}

export interface ModelFilters {
  provider?: string
  author?: string
  capabilities?: ModelCapability | ModelCapability[]
  [key: string]: any
}

export class ModelsClient {
  private api: ApiClient

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://models.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  /**
   * List available models with optional filtering
   */
  async listModels(filters: ModelFilters = {}): Promise<Record<string, ModelDetails>> {
    const params: Record<string, string> = {}

    if (filters.provider) {
      params.provider = filters.provider
    }

    if (filters.author) {
      params.author = filters.author
    }

    if (filters.capabilities) {
      const capabilitiesArray = Array.isArray(filters.capabilities) ? filters.capabilities : [filters.capabilities]
      params.capabilities = capabilitiesArray.join(',')
    }

    return this.api.get('/api/models', params)
  }

  /**
   * Get details about a specific model
   */
  async getModel(modelIdentifier: string): Promise<{ model: ModelDetails }> {
    return this.api.get(`/api/models/${modelIdentifier}`)
  }

  /**
   * Compare models based on their capabilities
   */
  async compareModels(modelIdentifiers: string[]): Promise<Record<string, ModelDetails>> {
    const models: Record<string, ModelDetails> = {}

    for (const modelId of modelIdentifiers) {
      const result = await this.getModel(modelId)
      if (result.model) {
        models[result.model.name] = result.model
      }
    }

    return models
  }

  /**
   * Find models that have all the specified capabilities
   */
  async findModelsWithCapabilities(capabilities: ModelCapability[]): Promise<Record<string, ModelDetails>> {
    return this.listModels({ capabilities })
  }

  /**
   * Get all available providers
   */
  async getProviders(): Promise<string[]> {
    const result = await this.api.get<{ links?: { providers?: Record<string, string> } }>('/api/models')
    return Object.keys(result?.links?.providers || {}).map((key) => key.split(' ')[0]) // Remove the count in parentheses
  }

  /**
   * Get all available authors
   */
  async getAuthors(): Promise<string[]> {
    const result = await this.api.get<{ links?: { authors?: Record<string, string> } }>('/api/models')
    return Object.keys(result?.links?.authors || {}).map((key) => key.split(' ')[0]) // Remove the count in parentheses
  }
}

export default ModelsClient
