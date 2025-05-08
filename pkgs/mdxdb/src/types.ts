import type { CollectionMethods, DatabaseClient, DBOptions, QueryOptions, ListResponse, CollectionData, ResourceData } from './database-do-types.js'

/**
 * Extended options for MDX-specific configuration
 */
export interface MDXDBOptions extends DBOptions {
  /**
   * Database backend to use
   * @default 'filesystem'
   */
  backend?: 'filesystem' | 'payload'
  
  /**
   * Payload CMS instance (required when backend is 'payload')
   */
  payload?: any
  
  /**
   * Base path for MDX files
   * @default './content'
   */
  basePath?: string

  /**
   * File extension for MDX files
   * @default '.mdx'
   */
  fileExtension?: string

  /**
   * Whether to create directories if they don't exist
   * @default true
   */
  createDirectories?: boolean
}

/**
 * MDX document structure with frontmatter data and content
 */
export interface MDXDocument<T = Record<string, unknown>> {
  /**
   * Document ID (must be at root level for JSON-LD compatibility)
   */
  id: string

  /**
   * Document type (JSON-LD compatibility)
   */
  type?: string

  /**
   * JSON-LD context
   */
  context?: string | Record<string, unknown>

  /**
   * Document data (frontmatter)
   */
  data: T & {
    /**
     * Duplicate of ID for easier querying
     */
    $id?: string

    /**
     * Duplicate of type for easier querying
     */
    $type?: string

    /**
     * Duplicate of context for easier querying
     */
    $context?: string | Record<string, unknown>
  }

  /**
   * Document content (MDX content after frontmatter)
   */
  content: string
}

/**
 * Result of parsing an MDX file
 */
export interface ParsedMDX<T = Record<string, unknown>> {
  /**
   * Frontmatter data
   */
  data: T

  /**
   * MDX content
   */
  content: string

  /**
   * Original file path
   */
  filePath?: string
}

/**
 * Error thrown by mdxdb operations
 */
export class MDXDBError extends Error {
  /**
   * HTTP status code
   */
  statusCode: number

  /**
   * Operation that failed
   */
  operation: string

  /**
   * Collection that was being operated on
   */
  collection: string

  constructor(message: string, statusCode = 500, operation = '', collection = '') {
    super(message)
    this.name = 'MDXDBError'
    this.statusCode = statusCode
    this.operation = operation
    this.collection = collection
  }
}
