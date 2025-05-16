class ApisAPI {
  private baseUrl: string
  private apiKey?: string
  private headers: Record<string, string>

  constructor(options: { baseUrl?: string; apiKey?: string; headers?: Record<string, string> } = {}) {
    this.baseUrl = options.baseUrl || 'https://api.do'
    this.apiKey = options.apiKey
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.apiKey) {
      this.headers['Authorization'] = `Bearer ${this.apiKey}`
    }
  }

  async get(path: string, params?: Record<string, any>) {
    const url = new URL(path, this.baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async post(path: string, data?: any) {
    const url = new URL(path, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async put(path: string, data?: any) {
    const url = new URL(path, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async patch(path: string, data?: any) {
    const url = new URL(path, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'PATCH',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async delete(path: string) {
    const url = new URL(path, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async list<T>(resource: string, params?: any): Promise<any> {
    return this.get(`/v1/${resource}`, params)
  }

  async getById<T>(resource: string, id: string): Promise<T> {
    return this.get(`/v1/${resource}/${id}`)
  }

  async create<T>(resource: string, data: any): Promise<T> {
    return this.post(`/v1/${resource}`, data)
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    return this.put(`/v1/${resource}/${id}`, data)
  }

  async remove<T>(resource: string, id: string): Promise<T> {
    return this.delete(`/v1/${resource}/${id}`)
  }
}
import type { ErrorResponse, ListResponse, QueryParams, Package } from './types.js'

export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}

export class API {
  private api: ApisAPI

  constructor(options: ClientOptions = {}) {
    this.api = new ApisAPI(options)
  }

  /**
   * Validate an API token
   */
  async validateToken(token: string): Promise<{ valid: boolean; user?: any }> {
    try {
      const api = new ApisAPI({
        apiKey: token,
        baseUrl: this.api['baseUrl'],
      })

      const response = await api.get('/v1/auth/validate')
      return { valid: true, user: response }
    } catch (error) {
      return { valid: false }
    }
  }

  /**
   * List all packages
   */
  async listPackages(params?: QueryParams): Promise<ListResponse<Package>> {
    return this.api.list<Package>('packages', params)
  }

  /**
   * Get a package by ID
   */
  async getPackage(id: string): Promise<Package> {
    return this.api.getById<Package>('packages', id)
  }

  /**
   * Create a new package
   */
  async createPackage(data: Partial<Package>): Promise<Package> {
    return this.api.create<Package>('packages', data)
  }

  /**
   * Update a package
   */
  async updatePackage(id: string, data: Partial<Package>): Promise<Package> {
    return this.api.update<Package>('packages', id, data)
  }

  /**
   * Delete a package
   */
  async deletePackage(id: string): Promise<Package> {
    return this.api.remove<Package>('packages', id)
  }

  /**
   * Publish a package to NPM
   */
  async publishPackage(id: string, options: { tag?: string } = {}): Promise<any> {
    return this.api.post(`/v1/packages/${id}/publish`, options)
  }

  /**
   * List all functions
   */
  async listFunctions(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list<any>('functions', params)
  }

  /**
   * List all workflows
   */
  async listWorkflows(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list<any>('workflows', params)
  }

  /**
   * List all databases
   */
  async listDatabases(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list<any>('databases', params)
  }

  /**
   * Add a collection to a package
   */
  async addCollectionToPackage(packageId: string, collection: string): Promise<any> {
    return this.api.post(`/v1/packages/${packageId}/collections`, { collection })
  }

  /**
   * Remove a collection from a package
   */
  async removeCollectionFromPackage(packageId: string, collection: string): Promise<any> {
    return this.api.delete(`/v1/packages/${packageId}/collections/${collection}`)
  }

  /**
   * Update package.json for a package
   */
  async updatePackageJson(packageId: string, packageJson: any): Promise<any> {
    return this.api.patch(`/v1/packages/${packageId}`, { package: packageJson })
  }
}
