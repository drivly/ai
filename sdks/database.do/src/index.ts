import { API } from 'apis.do/src/client'
import type { ClientOptions, ListResponse, QueryParams } from 'apis.do/types'

import { DBOptions, SchemaDefinition, CollectionMethods, QueryOptions, CollectionData, DatabaseClient as DatabaseClientType } from './types'

export * from './types'

/**
 * Standardized error handling utility for database operations
 * @param error Original error object
 * @param operation Operation type (find, findOne, create, update, delete, search)
 * @param collection Collection name
 * @returns Never - always throws an enhanced error
 */
export const handleApiError = (error: any, operation: string, collection: string): never => {
  const errorMessage = error.message || 'Unknown error'
  const statusCode = error.status || error.statusCode || 500
  const enhancedError = new Error(`${operation} operation failed on collection '${collection}': ${errorMessage}`)

  Object.assign(enhancedError, {
    statusCode,
    operation,
    collection,
    originalError: error,
  })

  throw enhancedError
}

/**
 * Handles operations for a specific collection
 * @template T Type of documents in the collection
 */
class CollectionHandler<T = CollectionData> implements CollectionMethods<T> {
  private api: API
  private collection: string

  /**
   * Creates a new collection handler
   * @param api API client instance
   * @param collection Collection name
   */
  constructor(api: API, collection: string) {
    this.api = api
    this.collection = collection
  }

  /**
   * Find documents in the collection
   * @template T Type of documents to return
   * @param options Query options including filtering, sorting, and pagination
   * @returns Promise resolving to a list of documents
   * @example
   * const posts = await db.posts.find({
   *   where: { status: 'published' },
   *   limit: 10,
   *   sort: 'createdAt:desc'
   * })
   */
  async find<T = CollectionData>(options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      return await this.api.list<T>(this.collection, options)
    } catch (error) {
      return handleApiError(error, 'find', this.collection)
    }
  }

  /**
   * Find a single document by ID
   * @template T Type of document to return
   * @param id Document ID
   * @returns Promise resolving to a single document
   * @example
   * const post = await db.posts.findOne('post-123')
   */
  async findOne<T = CollectionData>(id: string): Promise<T> {
    try {
      return await this.api.getById<T>(this.collection, id)
    } catch (error) {
      return handleApiError(error, 'findOne', this.collection)
    }
  }

  /**
   * Create a new document in the collection
   * @template T Type of document to create
   * @param data Document data
   * @returns Promise resolving to the created document
   * @example
   * const post = await db.posts.create({
   *   title: 'New Post',
   *   content: 'Content here'
   * })
   */
  async create<T = CollectionData>(data: Partial<T>): Promise<T> {
    try {
      return await this.api.create<T>(this.collection, data)
    } catch (error) {
      return handleApiError(error, 'create', this.collection)
    }
  }

  /**
   * Update an existing document
   * @template T Type of document to update
   * @param id Document ID
   * @param data Updated document data
   * @returns Promise resolving to the updated document
   * @example
   * const updatedPost = await db.posts.update('post-123', {
   *   title: 'Updated Title'
   * })
   */
  async update<T = CollectionData>(id: string, data: Partial<T>): Promise<T> {
    try {
      return await this.api.update<T>(this.collection, id, data)
    } catch (error) {
      return handleApiError(error, 'update', this.collection)
    }
  }

  /**
   * Delete a document
   * @template T Type of deleted document
   * @param id Document ID
   * @returns Promise resolving to the deleted document
   * @example
   * await db.posts.delete('post-123')
   */
  async delete<T = CollectionData>(id: string): Promise<T> {
    try {
      return await this.api.remove<T>(this.collection, id)
    } catch (error) {
      return handleApiError(error, 'delete', this.collection)
    }
  }

  /**
   * Search for documents
   * @template T Type of documents to search
   * @param query Search query string
   * @param options Query options
   * @returns Promise resolving to a list of matching documents
   * @example
   * const results = await db.posts.search('keyword', {
   *   limit: 20,
   *   sort: 'relevance:desc'
   * })
   */
  async search<T = CollectionData>(query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      return await this.api.search<T>(this.collection, query, options)
    } catch (error) {
      return handleApiError(error, 'search', this.collection)
    }
  }
}

/**
 * Creates a database client with the provided options
 * @param options Configuration options for the database client
 * @returns A proxy-based database client that provides collection-based access
 * @example
 * const db = DB({ apiKey: 'my-api-key' })
 * const user = await db.users.findOne('user-id')
 */
export const DB = (options: DBOptions = {}): DatabaseClientType => {
  const { baseUrl, apiKey, ...schemaDefinitions } = options

  const apiOptions: ClientOptions = {
    baseUrl: baseUrl || 'https://database.do',
    apiKey,
  }

  const api = new API(apiOptions)

  return new Proxy({} as DatabaseClientType, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        const collectionName = prop === 'resources' ? 'things' : prop
        return new CollectionHandler(api, collectionName)
      }
      return target[prop as keyof typeof target]
    },
  })
}

/**
 * Default database client instance
 */
export const db = DB()

/**
 * Class-based database client implementation
 */
export class DatabaseClient {
  private api: API
  public resources: CollectionMethods

  /**
   * Creates a new DatabaseClient instance
   * @param options Configuration options
   */
  constructor(options: DBOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://database.do',
      apiKey: options.apiKey,
    }

    this.api = new API(apiOptions)

    this.resources = new CollectionHandler(this.api, 'things')
  }

  /**
   * Find documents in a collection
   * @template T Type of documents to return
   * @param collection Collection name
   * @param options Query options
   * @returns Promise resolving to a list of documents
   */
  async find<T = CollectionData>(collection: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const collectionName = collection === 'resources' ? 'things' : collection
      return await this.api.list<T>(collectionName, options)
    } catch (error) {
      return handleApiError(error, 'find', collection)
    }
  }

  /**
   * Find a single document by ID
   * @template T Type of document to return
   * @param collection Collection name
   * @param id Document ID
   * @returns Promise resolving to a single document
   */
  async findOne<T = CollectionData>(collection: string, id: string): Promise<T> {
    try {
      const collectionName = collection === 'resources' ? 'things' : collection
      return await this.api.getById<T>(collectionName, id)
    } catch (error) {
      return handleApiError(error, 'findOne', collection)
    }
  }

  /**
   * Create a new document
   * @template T Type of document to create
   * @param collection Collection name
   * @param data Document data
   * @returns Promise resolving to the created document
   */
  async create<T = CollectionData>(collection: string, data: Partial<T>): Promise<T> {
    try {
      const collectionName = collection === 'resources' ? 'things' : collection
      return await this.api.create<T>(collectionName, data)
    } catch (error) {
      return handleApiError(error, 'create', collection)
    }
  }

  /**
   * Update an existing document
   * @template T Type of document to update
   * @param collection Collection name
   * @param id Document ID
   * @param data Updated document data
   * @returns Promise resolving to the updated document
   */
  async update<T = CollectionData>(collection: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const collectionName = collection === 'resources' ? 'things' : collection
      return await this.api.update<T>(collectionName, id, data)
    } catch (error) {
      return handleApiError(error, 'update', collection)
    }
  }

  /**
   * Delete a document
   * @template T Type of deleted document
   * @param collection Collection name
   * @param id Document ID
   * @returns Promise resolving to the deleted document
   */
  async delete<T = CollectionData>(collection: string, id: string): Promise<T> {
    try {
      const collectionName = collection === 'resources' ? 'things' : collection
      return await this.api.remove<T>(collectionName, id)
    } catch (error) {
      return handleApiError(error, 'delete', collection)
    }
  }

  /**
   * Search for documents
   * @template T Type of documents to search
   * @param collection Collection name
   * @param query Search query string
   * @param options Query options
   * @returns Promise resolving to a list of matching documents
   */
  async search<T = CollectionData>(collection: string, query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const collectionName = collection === 'resources' ? 'things' : collection
      return await this.api.search<T>(collectionName, query, options)
    } catch (error) {
      return handleApiError(error, 'search', collection)
    }
  }
}

export default DB
