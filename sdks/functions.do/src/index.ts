import { ApiClient } from './api'

export interface SlackBlockSchema {
  title: string
  description: string
  options?: string[]
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  timeout?: number
  channel?: string
  mentions?: string[]
  blocks?: SlackBlock[] // Direct BlockKit components
  modal?: boolean // Support for modal dialogs
  components?: {
    datePicker?: boolean
    timePicker?: boolean
    multiSelect?: boolean
    overflow?: boolean
    image?: boolean
    context?: boolean
    divider?: boolean
    header?: boolean
    section?: boolean
  }
}

/**
 * Slack Block type for advanced UI components
 */
export interface SlackBlock {
  type: string
  block_id?: string
  [key: string]: any
}

export interface FunctionDefinition {
  type?: 'Generation' | 'Code' | 'Human' | 'Agent'
  format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video'
  schema?: any
  prompt?: string
  code?: string
  role?: string
  agent?: string
  blocks?: SlackBlockSchema
  [key: string]: any
}

export interface AIConfig {
  [key: string]: any
}

export interface FunctionResponse<T = any> {
  data: T
  meta?: {
    duration?: number
    modelName?: string
    [key: string]: any
  }
}

export class FunctionsClient {
  private api: ApiClient

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://apis.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  async run<T = any>(functionName: string, input: any, config?: AIConfig): Promise<FunctionResponse<T>> {
    return this.api.post<FunctionResponse<T>>(`/v1/functions/${functionName}`, {
      input,
      config,
    })
  }

  async create(functionDefinition: {
    name: string
    description?: string
    type?: 'Generation' | 'Code' | 'Human' | 'Agent'
    format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video'
    schema?: any
    prompt?: string
    code?: string
    role?: string
    user?: string
    agent?: string
  }): Promise<any> {
    return this.api.post('/v1/functions', functionDefinition)
  }

  async list(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.list('functions', params)
  }

  async get(functionId: string): Promise<any> {
    return this.api.getById('functions', functionId)
  }

  async update(functionId: string, data: any): Promise<any> {
    return this.api.update('functions', functionId, data)
  }

  async delete(functionId: string): Promise<any> {
    return this.api.remove('functions', functionId)
  }
}

export default FunctionsClient
