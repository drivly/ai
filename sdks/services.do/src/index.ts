import { API } from 'apis.do'
import type { ServiceDefinition, Service, ServiceQuery } from '../types'

export class Services {
  private api: API

  constructor(options?: { apiKey?: string; baseUrl?: string }) {
    this.api = new API(options)
  }

  /**
   * Discover services based on query parameters
   */
  async discover(query?: ServiceQuery): Promise<Service[]> {
    const response = await this.api.list<Service>('services', query)
    return response.data
  }

  /**
   * Register a new service
   */
  async register(service: ServiceDefinition): Promise<Service> {
    return this.api.create<Service>('services', service)
  }

  /**
   * Get service details by ID
   */
  async get(id: string): Promise<Service> {
    return this.api.getById<Service>('services', id)
  }

  /**
   * Update service details
   */
  async update(id: string, updates: Partial<ServiceDefinition>): Promise<Service> {
    return this.api.update<Service>('services', id, updates)
  }

  /**
   * Deregister a service
   */
  async deregister(id: string): Promise<Service> {
    return this.api.remove<Service>('services', id)
  }
}

export type { ServiceDefinition, Service, ServiceQuery } from '../types'
export default Services
