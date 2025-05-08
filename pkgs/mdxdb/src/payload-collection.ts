import { CollectionMethods, ListResponse, QueryOptions } from './database-do-types.js'
import { PayloadHandler } from './payload-handler.js'
import { MDXDBError } from './types.js'

/**
 * Collection handler for Payload CMS
 */
export class PayloadCollectionHandler<T = Record<string, unknown>> implements CollectionMethods<T> {
  private handler: PayloadHandler
  private collection: string
  
  /**
   * Creates a new PayloadCollectionHandler
   * @param handler Payload handler
   * @param collection Collection name
   */
  constructor(handler: PayloadHandler, collection: string) {
    this.handler = handler
    this.collection = collection
  }
  
  /**
   * Finds documents in the collection
   * @param options Query options
   * @returns List response with documents
   */
  async find(options: QueryOptions = {}): Promise<ListResponse<T>> {
    try {
      const ids = await this.handler.readDirectory(this.collection)
      
      const documents = await Promise.all(ids.map((id) => this.handler.readFile<T>(this.collection, id)))
      
      let filteredDocs = documents
      
      if (options.where) {
        filteredDocs = filteredDocs.filter((doc) => {
          for (const [key, value] of Object.entries(options.where || {})) {
            if (doc.data[key] !== value) {
              return false
            }
          }
          return true
        })
      }
      
      if (options.sort) {
        const sortFields = Array.isArray(options.sort) ? options.sort : [options.sort]
        
        filteredDocs.sort((a, b) => {
          for (const sortField of sortFields) {
            const [field, direction] = sortField.split(':')
            const aValue = a.data[field]
            const bValue = b.data[field]
            
            if (aValue < bValue) return direction === 'desc' ? 1 : -1
            if (aValue > bValue) return direction === 'desc' ? -1 : 1
          }
          return 0
        })
      }
      
      const page = options.page || 1
      const limit = options.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const totalDocs = filteredDocs.length
      
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex)
      
      const docs = paginatedDocs.map((doc) => {
        const { $id, $type, $context, ...rest } = doc.data
        return {
          ...rest,
          id: doc.id,
          content: doc.content,
        }
      }) as T[]
      
      return {
        data: docs,
        meta: {
          total: totalDocs,
          page,
          pageSize: limit,
          hasNextPage: endIndex < totalDocs,
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
      const doc = await this.handler.readFile<T>(this.collection, id)
      
      const { $id, $type, $context, ...rest } = doc.data
      return {
        ...rest,
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
      
      const id = (data as any).id || crypto.randomUUID()
      
      await this.handler.writeFile(this.collection, id, dataWithoutContent, content)
      
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
      const existingDoc = await this.handler.readFile<T>(this.collection, id)
      
      const content = (data as any).content !== undefined ? (data as any).content : existingDoc.content
      
      const dataWithoutContent = { ...data }
      delete (dataWithoutContent as any).content
      
      const mergedData = {
        ...existingDoc.data,
        ...dataWithoutContent,
      }
      
      await this.handler.writeFile(this.collection, id, mergedData, content)
      
      const { $id, $type, $context, ...rest } = mergedData
      return {
        ...rest,
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
      const doc = await this.handler.readFile<T>(this.collection, id)
      
      await this.handler.deleteFile(this.collection, id)
      
      const { $id, $type, $context, ...rest } = doc.data
      return {
        ...rest,
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
      const ids = await this.handler.readDirectory(this.collection)
      
      const documents = await Promise.all(ids.map((id) => this.handler.readFile<T>(this.collection, id)))
      
      const searchResults = documents.filter((doc) => {
        const content = doc.content.toLowerCase()
        const queryLower = query.toLowerCase()
        
        if (content.includes(queryLower)) {
          return true
        }
        
        for (const value of Object.values(doc.data)) {
          if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
            return true
          }
        }
        
        return false
      })
      
      let filteredDocs = searchResults
      
      if (options.where) {
        filteredDocs = filteredDocs.filter((doc) => {
          for (const [key, value] of Object.entries(options.where || {})) {
            if (doc.data[key] !== value) {
              return false
            }
          }
          return true
        })
      }
      
      const sortOption = options.sort || 'relevance:desc'
      const sortFields = Array.isArray(sortOption) ? sortOption : [sortOption]
      
      filteredDocs.sort((a, b) => {
        for (const sortField of sortFields) {
          const [field, direction] = sortField.split(':')
          
          if (field === 'relevance') {
            return 0
          }
          
          const aValue = a.data[field]
          const bValue = b.data[field]
          
          if (aValue < bValue) return direction === 'desc' ? 1 : -1
          if (aValue > bValue) return direction === 'desc' ? -1 : 1
        }
        return 0
      })
      
      const page = options.page || 1
      const limit = options.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const totalDocs = filteredDocs.length
      
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex)
      
      const docs = paginatedDocs.map((doc) => {
        const { $id, $type, $context, ...rest } = doc.data
        return {
          ...rest,
          id: doc.id,
          content: doc.content,
        }
      }) as T[]
      
      return {
        data: docs,
        meta: {
          total: totalDocs,
          page,
          pageSize: limit,
          hasNextPage: endIndex < totalDocs,
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
