import type { CollectionConfig } from 'payload'
import { 
  PayloadPlugin, 
  HookHandlerOptions, 
  TaskConfig, 
  HookConfig, 
  CollectionHookConfig,
  HookQueuePluginConfig,
  HookType,
  CollectionHookPattern
} from './types'

/**
 * Helper to normalize hook config to standard format
 */
const normalizeHookConfig = (config: HookConfig): CollectionHookConfig => {
  if (typeof config === 'string') {
    return {
      afterChange: [{ slug: config }]
    }
  } else if (Array.isArray(config)) {
    return {
      afterChange: config.map(slug => typeof slug === 'string' ? { slug } : slug)
    }
  } else {
    const result: CollectionHookConfig = {}
    
    for (const hookType of ['beforeChange', 'afterChange', 'beforeDelete', 'afterDelete'] as const) {
      if (config[hookType]) {
        result[hookType] = config[hookType]!.map(item => {
          if (typeof item === 'string') {
            return { slug: item }
          }
          return item
        })
      }
    }
    
    return result
  }
}

/**
 * Normalize a collection.hook pattern value to a standard format
 */
const normalizePatternValue = (
  value: string | TaskConfig | Array<string | TaskConfig>
): Array<TaskConfig> => {
  if (typeof value === 'string') {
    return [{ slug: value }]
  } else if (Array.isArray(value)) {
    return value.map(item => typeof item === 'string' ? { slug: item } : item)
  } else {
    return [value]
  }
}

/**
 * Process a hook by running the associated task
 */
const processHook = async (
  hooks: Array<string | TaskConfig> | undefined,
  options: HookHandlerOptions,
  payload: any
) => {
  if (!hooks || !hooks.length) return
  
  await Promise.all(
    hooks.map(async (hook) => {
      const config = typeof hook === 'string' ? { slug: hook } : hook
      const { slug, input = {} } = config
      
      if (payload?.db?.tasks) {
        try {
          const context = {
            collection: options.collection,
            operation: options.operation,
            data: options.data,
            originalDoc: options.originalDoc
          }
          
          return payload.db.tasks.run({
            slug,
            input: {
              ...input,
              ...(Object.keys(input).length === 0 ? options.data : {}),
              context
            }
          })
        } catch (error) {
          console.error(`Error running task ${slug}:`, error)
        }
      }
    })
  )
}

/**
 * Parse collection.hook pattern keys from config
 */
const parsePatternKeys = (config: HookQueuePluginConfig): Record<string, CollectionHookConfig> => {
  const result: Record<string, CollectionHookConfig> = {}
  
  for (const key in config) {
    if (key === 'collections' || key === 'global' || key === 'excludeFromGlobal') {
      continue
    }
    
    const match = key.match(/^(.+)\.(.+)$/)
    if (match) {
      const [, collection, hookType] = match
      
      if (!['beforeChange', 'afterChange', 'beforeDelete', 'afterDelete'].includes(hookType)) {
        console.warn(`Invalid hook type in pattern: ${key}`)
        continue
      }
      
      if (!result[collection]) {
        result[collection] = {}
      }
      
      result[collection][hookType as HookType] = normalizePatternValue(config[key as CollectionHookPattern])
    }
  }
  
  return result
}

/**
 * Creates a Payload plugin that allows queueing tasks or workflows
 * from collection hooks with a simple API
 */
export const createHooksQueuePlugin = (config: HookQueuePluginConfig): PayloadPlugin => {
  const globalHooks = config.global ? normalizeHookConfig(config.global) : undefined
  const excludeFromGlobal = config.excludeFromGlobal || []
  
  const patternCollections = parsePatternKeys(config)
  
  const mergedCollections: Record<string, CollectionHookConfig> = {}
  
  if (config.collections) {
    for (const collection in config.collections) {
      mergedCollections[collection] = normalizeHookConfig(config.collections[collection])
    }
  }
  
  for (const collection in patternCollections) {
    if (!mergedCollections[collection]) {
      mergedCollections[collection] = patternCollections[collection]
    } else {
      for (const hookType of ['beforeChange', 'afterChange', 'beforeDelete', 'afterDelete'] as const) {
        if (patternCollections[collection][hookType]) {
          if (!mergedCollections[collection][hookType]) {
            mergedCollections[collection][hookType] = patternCollections[collection][hookType]
          } else {
            mergedCollections[collection][hookType] = [
              ...(mergedCollections[collection][hookType] || []),
              ...(patternCollections[collection][hookType] || [])
            ]
          }
        }
      }
    }
  }
  
  return {
    collections: (incomingCollections: CollectionConfig[]) => {
      return incomingCollections.map((collection) => {
        const collectionSlug = collection.slug
        
        let collectionConfig = mergedCollections[collectionSlug]
        if (!collectionConfig && mergedCollections['*']) {
          collectionConfig = mergedCollections['*']
        }
        
        if (!collectionConfig && !globalHooks) {
          return collection
        }
        
        const collectionHooks = collectionConfig
        
        const isExcludedFromGlobal = excludeFromGlobal.includes(collectionSlug)
        
        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            beforeChange: [
              ...(collection.hooks?.beforeChange || []),
              async ({ data, originalDoc, req }: { data: any; originalDoc: any; req: any }) => {
                if (collectionHooks?.beforeChange) {
                  await processHook(
                    collectionHooks.beforeChange,
                    {
                      collection: collectionSlug,
                      operation: originalDoc ? 'update' : 'create',
                      data,
                      originalDoc,
                      req
                    },
                    req?.payload
                  )
                }
                
                if (globalHooks?.beforeChange && !isExcludedFromGlobal) {
                  await processHook(
                    globalHooks.beforeChange,
                    {
                      collection: collectionSlug,
                      operation: originalDoc ? 'update' : 'create',
                      data,
                      originalDoc,
                      req
                    },
                    req?.payload
                  )
                }
                
                return data
              },
            ],
            afterChange: [
              ...(collection.hooks?.afterChange || []),
              async ({ doc, previousDoc, req }: { doc: any; previousDoc: any; req: any }) => {
                if (collectionHooks?.afterChange) {
                  await processHook(
                    collectionHooks.afterChange,
                    {
                      collection: collectionSlug,
                      operation: previousDoc ? 'update' : 'create',
                      data: doc,
                      originalDoc: previousDoc,
                      req
                    },
                    req?.payload
                  )
                }
                
                if (globalHooks?.afterChange && !isExcludedFromGlobal) {
                  await processHook(
                    globalHooks.afterChange,
                    {
                      collection: collectionSlug,
                      operation: previousDoc ? 'update' : 'create',
                      data: doc,
                      originalDoc: previousDoc,
                      req
                    },
                    req?.payload
                  )
                }
                
                return doc
              },
            ],
            beforeDelete: [
              ...(collection.hooks?.beforeDelete || []),
              async ({ id, req }: { id: any; req: any }) => {
                if (collectionHooks?.beforeDelete) {
                  await processHook(
                    collectionHooks.beforeDelete,
                    {
                      collection: collectionSlug,
                      operation: 'delete',
                      data: { id },
                      req
                    },
                    req?.payload
                  )
                }
                
                if (globalHooks?.beforeDelete && !isExcludedFromGlobal) {
                  await processHook(
                    globalHooks.beforeDelete,
                    {
                      collection: collectionSlug,
                      operation: 'delete',
                      data: { id },
                      req
                    },
                    req?.payload
                  )
                }
              },
            ],
            afterDelete: [
              ...(collection.hooks?.afterDelete || []),
              async ({ id, doc, req }: { id: any; doc: any; req: any }) => {
                if (collectionHooks?.afterDelete) {
                  await processHook(
                    collectionHooks.afterDelete,
                    {
                      collection: collectionSlug,
                      operation: 'delete',
                      data: { id },
                      originalDoc: doc,
                      req
                    },
                    req?.payload
                  )
                }
                
                if (globalHooks?.afterDelete && !isExcludedFromGlobal) {
                  await processHook(
                    globalHooks.afterDelete,
                    {
                      collection: collectionSlug,
                      operation: 'delete',
                      data: { id },
                      originalDoc: doc,
                      req
                    },
                    req?.payload
                  )
                }
              },
            ],
          },
        }
      })
    },
  }
}
