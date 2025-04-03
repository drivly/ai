import type { CollectionConfig } from 'payload'

import type { Plugin } from 'payload'

/**
 * Interface for a Payload plugin
 */
export interface PayloadPlugin extends Omit<Plugin, 'collections'> {
  collections?: (collections: any[]) => any[]
  globals?: (globals: any[]) => any[]
  endpoints?: (endpoints: any[]) => any[]
  admin?: {
    components?: Record<string, any>
    webpack?: (config: any) => any
  }
}

/**
 * Options provided to hook handlers
 */
export interface HookHandlerOptions {
  collection: string
  operation: 'create' | 'update' | 'delete'
  data?: any
  originalDoc?: any
  req?: any
}

/**
 * Configuration for a task to be run
 */
export interface TaskConfig {
  slug: string
  input?: Record<string, any>
  condition?: string | ((options: HookHandlerOptions) => boolean)
  /**
   * @description String conditions are evaluated in a context with access to:
   * - data: The data being processed (for beforeChange) or the document (for afterChange)
   * - doc: The document (same as data for afterChange)
   * - originalDoc: The original document before changes
   * - id: The document ID
   * - collection: The collection name
   * - operation: The operation type ('create', 'update', or 'delete')
   * 
   * Example: 'doc.type === "Code" && doc.code'
   */
}

/**
 * Configuration for hooks in a specific collection
 */
export interface CollectionHookConfig {
  beforeChange?: Array<string | TaskConfig>
  afterChange?: Array<string | TaskConfig>
  beforeDelete?: Array<string | TaskConfig>
  afterDelete?: Array<string | TaskConfig>
}

/**
 * Simplified hook configuration - can be:
 * - A string (task/workflow name)
 * - An array of strings (task/workflow names)
 * - A detailed configuration object
 */
export type HookConfig = string | string[] | CollectionHookConfig

/**
 * Plugin configuration for hook queuing
 */
export interface HookQueuePluginConfig {
  collections?: Record<string, HookConfig>
  global?: HookConfig
}
