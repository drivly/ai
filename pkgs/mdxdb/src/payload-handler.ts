import { MDXDBError } from './types.js'

/**
 * Handles Payload CMS operations
 */
export class PayloadHandler {
  private payload: any
  
  /**
   * Creates a new PayloadHandler
   * @param payload Payload CMS instance
   */
  constructor(payload: any) {
    this.payload = payload
  }
  
  /**
   * Reads all documents in a collection
   * @param collection Collection name
   * @returns Array of document IDs
   */
  async readDirectory(collection: string): Promise<string[]> {
    try {
      const response = await this.payload.find({
        collection,
        limit: 1000, // Use a high limit to get all documents
      })
      
      return response.docs.map((doc: any) => doc.id)
    } catch (error) {
      if ((error as any)?.status === 404 || (error as any)?.statusCode === 404) {
        return []
      }
      
      throw new MDXDBError(`Failed to read collection: ${collection}`, 500, 'readDirectory', collection)
    }
  }
  
  /**
   * Reads a document from Payload CMS
   * @param collection Collection name
   * @param id Document ID
   * @returns Document data
   */
  async readFile<T = Record<string, unknown>>(collection: string, id: string): Promise<any> {
    try {
      const doc = await this.payload.findByID({
        collection,
        id,
      })
      
      return {
        id: doc.id,
        type: doc.type,
        context: doc.context,
        data: {
          ...doc,
          $id: doc.id,
          $type: doc.type,
          $context: doc.context,
        },
        content: doc.content || '',
      }
    } catch (error) {
      if ((error as any)?.status === 404 || (error as any)?.statusCode === 404) {
        throw new MDXDBError(`Document not found: ${id}`, 404, 'readFile', collection)
      }
      
      throw new MDXDBError(`Failed to read document: ${id}`, 500, 'readFile', collection)
    }
  }
  
  /**
   * Writes a document to Payload CMS
   * @param collection Collection name
   * @param id Document ID
   * @param data Document data
   * @param content Document content
   */
  async writeFile<T extends object = Record<string, unknown>>(
    collection: string,
    id: string,
    data: T,
    content = ''
  ): Promise<void> {
    try {
      const cleanData = { ...data, content }
      delete (cleanData as any).$id
      delete (cleanData as any).$type
      delete (cleanData as any).$context
      
      try {
        await this.payload.findByID({
          collection,
          id,
        })
        
        await this.payload.update({
          collection,
          id,
          data: cleanData,
        })
      } catch (error) {
        await this.payload.create({
          collection,
          data: { id, ...cleanData },
        })
      }
    } catch (error) {
      throw new MDXDBError(`Failed to write document: ${id}`, 500, 'writeFile', collection)
    }
  }
  
  /**
   * Deletes a document from Payload CMS
   * @param collection Collection name
   * @param id Document ID
   */
  async deleteFile(collection: string, id: string): Promise<void> {
    try {
      await this.payload.delete({
        collection,
        id,
      })
    } catch (error) {
      if ((error as any)?.status === 404 || (error as any)?.statusCode === 404) {
        throw new MDXDBError(`Document not found: ${id}`, 404, 'deleteFile', collection)
      }
      
      throw new MDXDBError(`Failed to delete document: ${id}`, 500, 'deleteFile', collection)
    }
  }
}
