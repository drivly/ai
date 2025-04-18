/**
 * Types for ai-database package
 */

import type { ClientOptions, QueryParams, ErrorResponse, ListResponse } from 'apis.do/types'

export type { ClientOptions, QueryParams, ErrorResponse, ListResponse }

/**
 * Options for embedding generation
 */
export interface EmbeddingOptions {
  /** Embedding model to use (defaults to openai:text-embedding-3-small) */
  model?: string
  /** Additional options for the embedding model */
  [key: string]: any
}

/**
 * Result of embedding generation
 */
export interface EmbeddingResult {
  /** Generated embedding vectors */
  embedding: number[][] | null
  /** Model used for embedding generation */
  model: string
  /** Whether the embedding generation was successful */
  success: boolean
  /** Error message if embedding generation failed */
  error?: string
}

/**
 * Generic collection data type
 */
export type CollectionData = Record<string, any>

/**
 * Query options for database operations
 */
export interface QueryOptions {
  /** Filter criteria */
  where?: Record<string, any>
  /** Sorting options (field:direction) */
  sort?: string | string[]
  /** Number of results per page */
  limit?: number
  /** Page number for pagination */
  page?: number
  /** Fields to include in the result */
  select?: string | string[]
  /** Relations to populate */
  populate?: string | string[]
}

/**
 * Methods available for each collection
 * @template T Document type for the collection
 */
export interface CollectionMethods<T = CollectionData> {
  /** Find documents in the collection */
  find: (options?: QueryOptions) => Promise<ListResponse<T>>
  /** Find a single document by ID */
  findOne: (id: string) => Promise<T>
  /** Create a new document */
  create: (data: Partial<T>) => Promise<T>
  /** Update an existing document */
  update: (id: string, data: Partial<T>) => Promise<T>
  /** Delete a document */
  delete: (id: string) => Promise<T>
  /** Search for documents */
  search: (query: string, options?: QueryOptions) => Promise<ListResponse<T>>
}

/**
 * Database client interface
 */
export interface DatabaseClientType {
  /** Dynamic access to any collection */
  [collection: string]: CollectionMethods
}

/**
 * Payload instance interface defining the minimum required methods
 */
export interface PayloadInstance {
  find?: (options: any) => Promise<any>
  findByID?: (options: any) => Promise<any>
  create?: (options: any) => Promise<any>
  update?: (options: any) => Promise<any>
  delete?: (options: any) => Promise<any>
  db?: any
  [key: string]: any
}

/**
 * Configuration for REST API-based Payload client
 */
export interface RestClientConfig {
  apiUrl: string
  apiKey?: string
  headers?: Record<string, string>
  fetchOptions?: RequestInit
}

/**
 * Options for DB initialization
 */
export interface DBOptions {
  baseUrl?: string
  apiKey?: string
  payload?: PayloadInstance
  apiUrl?: string
  headers?: Record<string, string>
  fetchOptions?: RequestInit
  [collection: string]: any
}

/**
 * Collection handler options
 */
export interface CollectionHandlerOptions {
  payload: PayloadInstance
  collectionName: string
}
