import PQueue from 'p-queue'

export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
  concurrency?: number
}

export interface ErrorResponse {
  error: {
    message: string
    code?: string
    status?: number
  }
}

export interface ListResponse<T = any> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined
}

export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>
  queue: PQueue

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.FUNCTIONS_API_URL || 'https://apis.do'

    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (options.apiKey) {
      this.headers['Authorization'] = `Bearer ${options.apiKey}`
    }

    this.queue = new PQueue({ concurrency: options.concurrency || 50 })
  }

  async request<T = any>(method: string, path: string, data?: any, queryParams?: QueryParams): Promise<T> {
    const requestFn = async () => {
      const url = new URL(path.startsWith('http') ? path : `${this.baseUrl}${path}`)

      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value))
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

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      return response.json() as T
    }

    return this.queue.add(requestFn) as Promise<T>
  }

  async get<T = any>(path: string, queryParams?: QueryParams): Promise<T> {
    return this.request<T>('GET', path, undefined, queryParams)
  }

  async post<T = any>(path: string, data?: any): Promise<T> {
    return this.request<T>('POST', path, data)
  }

  async put<T = any>(path: string, data?: any): Promise<T> {
    return this.request<T>('PUT', path, data)
  }

  async patch<T = any>(path: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', path, data)
  }

  async delete<T = any>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }

  async list<T = any>(resource: string, queryParams?: QueryParams): Promise<ListResponse<T>> {
    return this.get<ListResponse<T>>(`/v1/${resource}`, queryParams)
  }

  async getById<T = any>(resource: string, id: string): Promise<T> {
    return this.get<T>(`/v1/${resource}/${id}`)
  }

  async create<T = any>(resource: string, data: any): Promise<T> {
    return this.post<T>(`/v1/${resource}`, data)
  }

  async update<T = any>(resource: string, id: string, data: any): Promise<T> {
    return this.patch<T>(`/v1/${resource}/${id}`, data)
  }

  async replace<T = any>(resource: string, id: string, data: any): Promise<T> {
    return this.put<T>(`/v1/${resource}/${id}`, data)
  }

  async remove<T = any>(resource: string, id: string): Promise<T> {
    return this.delete<T>(`/v1/${resource}/${id}`)
  }

  async search<T = any>(resource: string, query: string, queryParams?: QueryParams): Promise<ListResponse<T>> {
    return this.get<ListResponse<T>>(`/v1/${resource}/search`, { q: query, ...queryParams })
  }
}
