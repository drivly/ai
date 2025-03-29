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
 * Payload instance that can be passed directly to client creation functions
 */
export type PayloadInstance = any // This should be refined based on the actual Payload types

/**
 * Configuration for REST API-based Payload client
 */
export interface RestPayloadClientConfig {
  apiUrl: string
  apiKey?: string
  headers?: Record<string, string>
}

/**
 * Combined configuration options for Payload client
 */
export type PayloadClientOptions = RestPayloadClientConfig | PayloadInstance
