import type { CollectionConfig } from 'payload'

/**
 * Interface for a Payload plugin
 */
export interface PayloadPlugin {
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
