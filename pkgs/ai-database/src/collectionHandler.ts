import { CollectionHandlerOptions, CollectionMethods, CollectionData, QueryOptions, ListResponse } from './types'
import { handleError, transformQueryOptions } from './utils'

/**
 * Handles operations for a specific collection
 * @template T Type of documents in the collection
 */
export class CollectionHandler<T = CollectionData> implements CollectionMethods<T> {
  private payload: any
  private collection: string

  /**
   * Creates a new collection handler
   * @param options Collection handler options
   */
  constructor(options: CollectionHandlerOptions) {
    this.payload = options.payload
    this.collection = options.collectionName
  }

  /**
   * Find documents in the collection
   * @template T Type of documents to return
   * @param options Query options including filtering, sorting, and pagination
   * @returns Promise resolving to a list of documents
   */
  async find<T = CollectionData>(options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const transformedOptions = transformQueryOptions(options)

      const result = await this.payload.find({
        collection: this.collection,
        ...transformedOptions,
      })

      return {
        docs: result.docs || [],
        totalDocs: result.totalDocs || 0,
        page: result.page || 1,
        totalPages: result.totalPages || 1,
        limit: result.limit || 10,
        hasPrevPage: result.hasPrevPage || false,
        hasNextPage: result.hasNextPage || false,
        prevPage: result.prevPage || null,
        nextPage: result.nextPage || null,
      }
    } catch (error) {
      return handleError(error, 'find', this.collection)
    }
  }

  /**
   * Find a single document by ID
   * @template T Type of document to return
   * @param id Document ID
   * @returns Promise resolving to a single document
   */
  async findOne<T = CollectionData>(id: string): Promise<T> {
    try {
      return (await this.payload.findByID({
        collection: this.collection,
        id,
      })) as T
    } catch (error) {
      return handleError(error, 'findOne', this.collection)
    }
  }

  /**
   * Create a new document in the collection
   * @template T Type of document to create
   * @param data Document data
   * @returns Promise resolving to the created document
   */
  async create<T = CollectionData>(data: Partial<T>): Promise<T> {
    try {
      return (await this.payload.create({
        collection: this.collection,
        data,
      })) as T
    } catch (error) {
      return handleError(error, 'create', this.collection)
    }
  }

  /**
   * Update an existing document
   * @template T Type of document to update
   * @param id Document ID
   * @param data Updated document data
   * @returns Promise resolving to the updated document
   */
  async update<T = CollectionData>(id: string, data: Partial<T>): Promise<T> {
    try {
      return (await this.payload.update({
        collection: this.collection,
        id,
        data,
      })) as T
    } catch (error) {
      return handleError(error, 'update', this.collection)
    }
  }

  /**
   * Delete a document
   * @template T Type of deleted document
   * @param id Document ID
   * @returns Promise resolving to the deleted document
   */
  async delete<T = CollectionData>(id: string): Promise<T> {
    try {
      return (await this.payload.delete({
        collection: this.collection,
        id,
      })) as T
    } catch (error) {
      return handleError(error, 'delete', this.collection)
    }
  }

  /**
   * Search for documents
   * @template T Type of documents to search
   * @param query Search query string
   * @param options Query options
   * @returns Promise resolving to a list of matching documents
   */
  async search<T = CollectionData>(query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const transformedOptions = transformQueryOptions(options)

      if (typeof this.payload.search === 'function') {
        const result = await this.payload.search({
          collection: this.collection,
          query,
          ...transformedOptions,
        })

        return {
          docs: result.docs || [],
          totalDocs: result.totalDocs || 0,
          page: result.page || 1,
          totalPages: result.totalPages || 1,
          limit: result.limit || 10,
          hasPrevPage: result.hasPrevPage || false,
          hasNextPage: result.hasNextPage || false,
          prevPage: result.prevPage || null,
          nextPage: result.nextPage || null,
        }
      }

      const result = await this.payload.find({
        collection: this.collection,
        search: query,
        ...transformedOptions,
      })

      return {
        docs: result.docs || [],
        totalDocs: result.totalDocs || 0,
        page: result.page || 1,
        totalPages: result.totalPages || 1,
        limit: result.limit || 10,
        hasPrevPage: result.hasPrevPage || false,
        hasNextPage: result.hasNextPage || false,
        prevPage: result.prevPage || null,
        nextPage: result.nextPage || null,
      }
    } catch (error) {
      return handleError(error, 'search', this.collection)
    }
  }
}
