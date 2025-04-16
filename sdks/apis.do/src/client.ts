import { ClientOptions, ErrorResponse, ListResponse, QueryParams } from './types'

export class API {
  private baseUrl: string
  private headers: Record<string, string>
  private options?: ClientOptions
  private integrations: Record<string, any> = {}
  private integrationsLoaded = false

  constructor(options: ClientOptions = {}) {
    this.options = options
    this.baseUrl = options.baseUrl || 'https://apis.do'
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (options.apiKey) {
      this.headers['Authorization'] = `Bearer ${options.apiKey}`
    }
  }

  private async request<T>(method: string, path: string, data?: any, params?: QueryParams): Promise<T> {
    const url = new URL(path, this.baseUrl)

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'where' && typeof value === 'object') {
            url.searchParams.append(key, JSON.stringify(value))
          } else {
            // Let URLSearchParams handle the encoding naturally
            url.searchParams.append(key, String(value))
          }
        }
      })
    }

    const options: RequestInit = {
      method,
      headers: this.headers,
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') && this.options?.ignoreSSLErrors) {
      try {
        const { Agent } = require('node:https')
        const fetchOptions = options as RequestInit & { agent?: any }
        fetchOptions.agent = new Agent({ rejectUnauthorized: false })
      } catch (e) {
        console.warn('SSL certificate validation will not be disabled in browser environment')
      }
    }

    const response = await fetch(url.toString(), options)
    const responseData = await response.json()

    if (!response.ok) {
      throw new Error((responseData as ErrorResponse).errors?.[0]?.message || `API request failed with status ${response.status}`)
    }

    return responseData as T
  }

  async get<T>(path: string, params?: QueryParams): Promise<T> {
    return this.request<T>('GET', path, undefined, params)
  }

  async post<T>(path: string, data: any): Promise<T> {
    return this.request<T>('POST', path, data)
  }

  async put<T>(path: string, data: any): Promise<T> {
    return this.request<T>('PUT', path, data)
  }

  async patch<T>(path: string, data: any): Promise<T> {
    return this.request<T>('PATCH', path, data)
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }

  async list<T>(collection: string, params?: QueryParams): Promise<ListResponse<T>> {
    return this.get<ListResponse<T>>(`/v1/${collection}`, params)
  }

  async getById<T>(collection: string, id: string): Promise<T> {
    return this.get<T>(`/v1/${collection}/${id}`)
  }

  async create<T>(collection: string, data: Partial<T>): Promise<T> {
    return this.post<T>(`/v1/${collection}`, data)
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T> {
    return this.patch<T>(`/v1/${collection}/${id}`, data)
  }

  async replace<T>(collection: string, id: string, data: T): Promise<T> {
    return this.put<T>(`/v1/${collection}/${id}`, data)
  }

  async remove<T>(collection: string, id: string): Promise<T> {
    return this.delete<T>(`/v1/${collection}/${id}`)
  }

  async search<T>(collection: string, query: string, params?: QueryParams): Promise<ListResponse<T>> {
    return this.get<ListResponse<T>>(`/v1/${collection}/search`, {
      ...params,
      q: query,
    })
  }

  /**
   * Private method to load available integrations
   */
  private async loadIntegrations(): Promise<void> {
    if (this.integrationsLoaded) return

    try {
      const response = await this.get<{ integrations: Record<string, string> }>('/integrations')
      
      for (const [name, url] of Object.entries(response.integrations)) {
        this.integrations[name] = this.createIntegrationProxy(name)
      }

      this.integrationsLoaded = true
    } catch (error) {
      console.error('Failed to load integrations:', error)
    }
  }

  /**
   * Create a proxy object for an integration
   */
  private createIntegrationProxy(integrationName: string): any {
    return new Proxy({}, {
      get: (_target, actionName: string) => {
        if (typeof actionName !== 'string' || actionName === 'then') {
          return undefined
        }
        
        return async (params: any) => {
          return this.post(`/integrations/${integrationName}/actions/${actionName}`, params)
        }
      }
    })
  }
}

/**
 * Create a proxied API instance that can access integrations
 */
export function createAPI(options: ClientOptions = {}): any {
  const api = new API(options)
  
  return new Proxy(api, {
    get(target: API, prop: string | symbol) {
      const value = Reflect.get(target, prop)
      if (value !== undefined) {
        return value
      }
      
      if (typeof prop === 'string') {
        return (async () => {
          if (!target['integrationsLoaded']) {
            await target['loadIntegrations']()
          }
          
          return target['integrations'][prop]
        })()
      }
      
      return undefined
    }
  })
}
