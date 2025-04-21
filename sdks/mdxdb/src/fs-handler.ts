import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXDocument, ParsedMDX, MDXDBError } from './types.js'

/**
 * Handles filesystem operations for MDX files
 */
export class MDXFileSystemHandler {
  private basePath: string
  private fileExtension: string
  private createDirectories: boolean

  /**
   * Creates a new MDXFileSystemHandler
   * @param basePath Base path for MDX files
   * @param fileExtension File extension for MDX files
   * @param createDirectories Whether to create directories if they don't exist
   */
  constructor(basePath: string, fileExtension: string, createDirectories = true) {
    this.basePath = basePath
    this.fileExtension = fileExtension
    this.createDirectories = createDirectories
  }

  /**
   * Gets the directory path for a collection
   * @param collection Collection name
   * @returns Directory path
   */
  private getCollectionPath(collection: string): string {
    return path.join(this.basePath, collection)
  }

  /**
   * Gets the file path for a document
   * @param collection Collection name
   * @param id Document ID
   * @returns File path
   */
  private getDocumentPath(collection: string, id: string): string {
    return path.join(this.getCollectionPath(collection), `${id}${this.fileExtension}`)
  }

  /**
   * Ensures a directory exists
   * @param dirPath Directory path
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true })
    } catch (error) {
      throw new MDXDBError(`Failed to create directory: ${dirPath}`, 500, 'ensureDirectory', path.basename(dirPath))
    }
  }

  /**
   * Reads all files in a collection directory
   * @param collection Collection name
   * @returns Array of file names (without extension)
   */
  async readDirectory(collection: string): Promise<string[]> {
    const dirPath = this.getCollectionPath(collection)

    try {
      if (this.createDirectories) {
        await this.ensureDirectory(dirPath)
      }

      const files = await fs.readdir(dirPath)

      return files.filter((file) => file.endsWith(this.fileExtension)).map((file) => file.slice(0, -this.fileExtension.length))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []
      }

      throw new MDXDBError(`Failed to read directory: ${dirPath}`, 500, 'readDirectory', collection)
    }
  }

  /**
   * Reads and parses an MDX file
   * @param collection Collection name
   * @param id Document ID
   * @returns Parsed MDX document
   */
  async readFile<T = Record<string, unknown>>(collection: string, id: string): Promise<MDXDocument<T>> {
    const filePath = this.getDocumentPath(collection, id)

    try {
      const content = await fs.readFile(filePath, 'utf-8')

      const { data, content: mdxContent } = matter(content)

      return {
        id,
        type: data.type,
        context: data.context,
        data: {
          ...data,
          $id: id,
          $type: data.type,
          $context: data.context,
        } as T & { $id?: string; $type?: string; $context?: string | Record<string, unknown> },
        content: mdxContent,
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new MDXDBError(`Document not found: ${id}`, 404, 'readFile', collection)
      }

      throw new MDXDBError(`Failed to read file: ${filePath}`, 500, 'readFile', collection)
    }
  }

  /**
   * Writes an MDX file
   * @param collection Collection name
   * @param id Document ID
   * @param data Document data
   * @param content Document content
   */
  async writeFile<T extends object = Record<string, unknown>>(collection: string, id: string, data: T, content = ''): Promise<void> {
    const dirPath = this.getCollectionPath(collection)
    const filePath = this.getDocumentPath(collection, id)

    try {
      if (this.createDirectories) {
        await this.ensureDirectory(dirPath)
      }

      const cleanData = { ...data }
      delete (cleanData as any).$id
      delete (cleanData as any).$type
      delete (cleanData as any).$context

      const mdx = matter.stringify(content, cleanData)

      await fs.writeFile(filePath, mdx)
    } catch (error) {
      throw new MDXDBError(`Failed to write file: ${filePath}`, 500, 'writeFile', collection)
    }
  }

  /**
   * Deletes an MDX file
   * @param collection Collection name
   * @param id Document ID
   */
  async deleteFile(collection: string, id: string): Promise<void> {
    const filePath = this.getDocumentPath(collection, id)

    try {
      await fs.unlink(filePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new MDXDBError(`Document not found: ${id}`, 404, 'deleteFile', collection)
      }

      throw new MDXDBError(`Failed to delete file: ${filePath}`, 500, 'deleteFile', collection)
    }
  }
}
