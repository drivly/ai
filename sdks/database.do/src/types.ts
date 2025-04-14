/**
 * Types for database.do SDK
 */

import type { ClientOptions, QueryParams, ErrorResponse, ListResponse } from 'apis.do/types'
export type { ClientOptions, QueryParams, ErrorResponse, ListResponse }

/**
 * Field types supported by the database
 */
export type FieldType = 'text' | 'richtext' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'tags[]' | string // For relationships and custom types

/**
 * Schema definition for collections
 */
export type SchemaDefinition = {
  [collection: string]: {
    [field: string]: FieldType
  }
}

/**
 * Generic collection data type
 */
export type CollectionData = Record<string, any>

/**
 * Resource data type (formerly Things)
 */
export interface ResourceData {
  id?: string
  name?: string
  sqid?: string
  hash?: string
  type?: string
  yaml?: string
  data?: Record<string, any>
  embedding?: any
  subjectOf?: string[]
  objectOf?: string[]
  createdAt?: string
  updatedAt?: string
}

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

export interface DBOptions {
  baseUrl?: string
  apiKey?: string
  [collection: string]: any
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
export interface DatabaseClient {
  /** Resources collection (formerly 'things') */
  resources: CollectionMethods<ResourceData>
  /** Dynamic access to any collection */
  [collection: string]: CollectionMethods
}
