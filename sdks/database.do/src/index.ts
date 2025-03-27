import { ApiClient } from './api-client'

export interface QueryOptions {
  where?: Record<string, any>
  sort?: string | string[]
  limit?: number
  page?: number
  select?: string | string[]
  populate?: string | string[]
}

export class DatabaseClient {
  private api: ApiClient

  constructor(options: { apiKey?: string, baseUrl?: string } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://database.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { 'Authorization': `Bearer ${options.apiKey}` } : {})
      }
    })
  }

  async find(collection: string, options: QueryOptions = {}): Promise<any> {
    return this.api.list(collection, options)
  }

  async findOne(collection: string, id: string): Promise<any> {
    return this.api.getById(collection, id)
  }

  async create(collection: string, data: any): Promise<any> {
    return this.api.create(collection, data)
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    return this.api.update(collection, id, data)
  }

  async delete(collection: string, id: string): Promise<any> {
    return this.api.remove(collection, id)
  }

  async search(collection: string, query: string, options: QueryOptions = {}): Promise<any> {
    return this.api.search(collection, query, options)
  }
}

export default DatabaseClient
