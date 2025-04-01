import { API as ApisAPI } from 'apis.do'
import type { ErrorResponse, ListResponse, QueryParams } from '../types.js'

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
   * List all packages
   */
  async listPackages(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list('packages', params)
  }

  /**
   * Get a package by ID
   */
  async getPackage(id: string): Promise<any> {
    return this.api.getById('packages', id)
  }

  /**
   * Create a new package
   */
  async createPackage(data: any): Promise<any> {
    return this.api.create('packages', data)
  }

  /**
   * Update a package
   */
  async updatePackage(id: string, data: any): Promise<any> {
    return this.api.update('packages', id, data)
  }

  /**
   * Delete a package
   */
  async deletePackage(id: string): Promise<any> {
    return this.api.remove('packages', id)
  }

  /**
   * Publish a package to NPM
   */
  async publishPackage(id: string, options: { tag?: string } = {}): Promise<any> {
    return this.api.post(`/api/packages/${id}/publish`, options)
  }

  /**
   * List all functions
   */
  async listFunctions(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list('functions', params)
  }

  /**
   * List all workflows
   */
  async listWorkflows(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list('workflows', params)
  }

  /**
   * List all databases
   */
  async listDatabases(params?: QueryParams): Promise<ListResponse<any>> {
    return this.api.list('databases', params)
  }

  /**
   * Add a collection to a package
   */
  async addCollectionToPackage(packageId: string, collection: string): Promise<any> {
    return this.api.post(`/api/packages/${packageId}/collections`, { collection })
  }

  /**
   * Remove a collection from a package
   */
  async removeCollectionFromPackage(packageId: string, collection: string): Promise<any> {
    return this.api.delete(`/api/packages/${packageId}/collections/${collection}`)
  }

  /**
   * Update package.json for a package
   */
  async updatePackageJson(packageId: string, packageJson: any): Promise<any> {
    return this.api.patch(`/api/packages/${packageId}`, { package: packageJson })
  }
}
