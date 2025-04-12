export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}

export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}

export interface ListResponse<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasNextPage?: boolean
  }
}

export interface QueryParams {
  [key: string]: any
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
}

export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(options: ClientOptions = {}) {
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

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'where' && typeof value === 'object') {
            url.searchParams.append(key, JSON.stringify(value))
          } else {
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
}
