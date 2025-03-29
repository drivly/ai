/**
 * Types for payload database operations
 */

export type CollectionQuery = Record<string, any>
export type CollectionData = Record<string, any>

export interface PayloadDBCollection {
  find: (query?: CollectionQuery) => Promise<any>
  findOne: (query?: CollectionQuery) => Promise<any> // Returns first item or null
  get: (id: string, query?: CollectionQuery) => Promise<any> // Alias for findById
  create: (data: CollectionData, query?: CollectionQuery) => Promise<any>
  update: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>
  upsert: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>
  set: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any> // Alias for update
  delete: (id: string, query?: CollectionQuery) => Promise<any>
}

export type PayloadDB = Record<string, PayloadDBCollection>

/**
 * Payload instance interface defining the minimum required methods
 * This is intentionally defined here instead of importing from 'payload'
 * to avoid runtime dependency on payload
 */
export interface PayloadInstance {
  find?: (options: any) => Promise<any>
  findByID?: (options: any) => Promise<any>
  create?: (options: any) => Promise<any>
  update?: (options: any) => Promise<any>
  delete?: (options: any) => Promise<any>
  auth?: {
    me?: () => Promise<any>
  }
  [key: string]: any
}

/**
 * Configuration for REST API-based Payload client
 */
export interface RestPayloadClientConfig {
  apiUrl: string
  apiKey?: string
  headers?: Record<string, string>
  fetchOptions?: RequestInit
}

/**
 * Combined configuration options for Payload client
 */
export type PayloadClientOptions = RestPayloadClientConfig | PayloadInstance
