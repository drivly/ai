import { CollectionMethods, ListResponse, QueryOptions } from './database-do-types.js'
import { MDXFileSystemHandler } from './fs-handler.js'
import { generateId, filterDocuments, sortDocuments, paginateDocuments, searchDocuments } from './utils.js'
import { MDXDBError } from './types.js'

/**
 * Collection handler for MDX files
 */
export class MDXCollectionHandler<T = Record<string, unknown>> implements CollectionMethods<T> {
  private fsHandler: MDXFileSystemHandler
  private collection: string

  /**
   * Creates a new MDXCollectionHandler
   * @param fsHandler Filesystem handler
   * @param collection Collection name
   */
  constructor(fsHandler: MDXFileSystemHandler, collection: string) {
    this.fsHandler = fsHandler
    this.collection = collection
  }

  /**
   * Finds documents in the collection
   * @param options Query options
   * @returns List response with documents
   */
  async find(options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const ids = await this.fsHandler.readDirectory(this.collection)

      const documents = await Promise.all(ids.map((id) => this.fsHandler.readFile<T>(this.collection, id)))

      const filteredDocs = filterDocuments(documents, options.where)

      const sortedDocs = sortDocuments(filteredDocs, options.sort)

      const { paginatedDocs, totalDocs, totalPages } = paginateDocuments(sortedDocs, options.limit, options.page)

      const docs = paginatedDocs.map((doc) => ({
        ...doc.data,
        id: doc.id,
        content: doc.content,
      })) as T[]

      return {
        data: docs,
        meta: {
          total: totalDocs,
          page: options.page || 1,
          pageSize: options.limit || 10,
          hasNextPage: (options.page || 1) * (options.limit || 10) < totalDocs,
        },
      }
    } catch (error) {
      if (error instanceof MDXDBError) {
        throw error
      }

      throw new MDXDBError(`find operation failed on collection '${this.collection}': ${(error as Error).message}`, 500, 'find', this.collection)
    }
  }

  /**
   * Finds a single document by ID
   * @param id Document ID
   * @returns Document
   */
  async findOne(id: string): Promise<T> {
    try {
      const doc = await this.fsHandler.readFile<T>(this.collection, id)

      return {
        ...doc.data,
        id: doc.id,
        content: doc.content,
      } as T
    } catch (error) {
      if (error instanceof MDXDBError) {
        throw error
      }

      throw new MDXDBError(
        `findOne operation failed on collection '${this.collection}': ${(error as Error).message}`,
        error instanceof MDXDBError ? error.statusCode : 500,
        'findOne',
        this.collection,
      )
    }
  }

  /**
   * Creates a new document
   * @param data Document data
   * @returns Created document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const content = (data as any).content || ''

      const dataWithoutContent = { ...data }
      delete (dataWithoutContent as any).content

      const id = (data as any).id || generateId(data)

      await this.fsHandler.writeFile(this.collection, id, dataWithoutContent, content)

      return {
        ...dataWithoutContent,
        id,
        content,
      } as T
    } catch (error) {
      if (error instanceof MDXDBError) {
        throw error
      }

      throw new MDXDBError(`create operation failed on collection '${this.collection}': ${(error as Error).message}`, 500, 'create', this.collection)
    }
  }

  /**
   * Updates a document
   * @param id Document ID
   * @param data Document data
   * @returns Updated document
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const existingDoc = await this.fsHandler.readFile<T>(this.collection, id)

      const content = (data as any).content !== undefined ? (data as any).content : existingDoc.content

      const dataWithoutContent = { ...data }
      delete (dataWithoutContent as any).content

      const mergedData = {
        ...existingDoc.data,
        ...dataWithoutContent,
      }

      await this.fsHandler.writeFile(this.collection, id, mergedData, content)

      return {
        ...mergedData,
        id,
        content,
      } as T
    } catch (error) {
      if (error instanceof MDXDBError) {
        throw error
      }

      throw new MDXDBError(
        `update operation failed on collection '${this.collection}': ${(error as Error).message}`,
        error instanceof MDXDBError ? error.statusCode : 500,
        'update',
        this.collection,
      )
    }
  }

  /**
   * Deletes a document
   * @param id Document ID
   * @returns Deleted document
   */
  async delete(id: string): Promise<T> {
    try {
      const doc = await this.fsHandler.readFile<T>(this.collection, id)

      await this.fsHandler.deleteFile(this.collection, id)

      return {
        ...doc.data,
        id: doc.id,
        content: doc.content,
      } as T
    } catch (error) {
      if (error instanceof MDXDBError) {
        throw error
      }

      throw new MDXDBError(
        `delete operation failed on collection '${this.collection}': ${(error as Error).message}`,
        error instanceof MDXDBError ? error.statusCode : 500,
        'delete',
        this.collection,
      )
    }
  }

  /**
   * Searches documents in the collection
   * @param query Search query
   * @param options Query options
   * @returns List response with documents
   */
  async search(query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const ids = await this.fsHandler.readDirectory(this.collection)

      const documents = await Promise.all(ids.map((id) => this.fsHandler.readFile<T>(this.collection, id)))

      const searchResults = searchDocuments(documents, query)

      const filteredDocs = filterDocuments(searchResults, options.where)

      const sortedDocs = sortDocuments(filteredDocs, options.sort || 'relevance:desc')

      const { paginatedDocs, totalDocs, totalPages } = paginateDocuments(sortedDocs, options.limit, options.page)

      const docs = paginatedDocs.map((doc) => ({
        ...doc.data,
        id: doc.id,
        content: doc.content,
      })) as T[]

      return {
        data: docs,
        meta: {
          total: totalDocs,
          page: options.page || 1,
          pageSize: options.limit || 10,
          hasNextPage: (options.page || 1) * (options.limit || 10) < totalDocs,
        },
      }
    } catch (error) {
      if (error instanceof MDXDBError) {
        throw error
      }

      throw new MDXDBError(`search operation failed on collection '${this.collection}': ${(error as Error).message}`, 500, 'search', this.collection)
    }
  }
}
