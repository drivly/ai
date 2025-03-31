import type { CollectionConfig } from 'payload'

export interface PayloadPlugin {
  collections?: (collections: any[]) => any[]
  globals?: (globals: any[]) => any[]
  endpoints?: (endpoints: any[]) => any[]
  admin?: {
    components?: Record<string, any>
    webpack?: (config: any) => any
  }
}

export interface HookHandlerOptions {
  collection: string
  operation: 'create' | 'update' | 'delete'
  data?: any
  originalDoc?: any
  req?: any
}

export type HookHandler = (options: HookHandlerOptions) => Promise<void>

export interface TaskConfig {
  slug: string
  input: Record<string, any>
}

export interface HookPluginConfig {
  collections?: Record<string, {
    beforeChange?: Array<HookHandler | TaskConfig>
    afterChange?: Array<HookHandler | TaskConfig>
    beforeDelete?: Array<HookHandler | TaskConfig>
    afterDelete?: Array<HookHandler | TaskConfig>
  }>
  globalHooks?: {
    beforeChange?: Array<HookHandler | TaskConfig>
    afterChange?: Array<HookHandler | TaskConfig>
    beforeDelete?: Array<HookHandler | TaskConfig>
    afterDelete?: Array<HookHandler | TaskConfig>
  }
}

/**
 * Creates a Payload plugin that allows hooking into collection operations
 * and triggering tasks or workflows
 */
export const createHooksPlugin = (config: HookPluginConfig): PayloadPlugin => {
  const processHook = async (
    hooks: Array<HookHandler | TaskConfig> | undefined,
    options: HookHandlerOptions,
    payload: any
  ) => {
    if (!hooks) return

    await Promise.all(
      hooks.map(async (hook) => {
        if (typeof hook === 'function') {
          return hook(options)
        } else {
          const { slug, input } = hook
          
          if (payload?.db?.tasks) {
            try {
              return payload.db.tasks.run({
                slug,
                input: {
                  ...input,
                  context: {
                    collection: options.collection,
                    operation: options.operation,
                    data: options.data,
                    originalDoc: options.originalDoc
                  }
                }
              })
            } catch (error) {
              console.error(`Error running task ${slug}:`, error)
            }
          }
        }
      })
    )
  }

  return {
    collections: (incomingCollections: CollectionConfig[]) => {
      return incomingCollections.map((collection) => {
        const collectionSlug = collection.slug
        const collectionHooks = config.collections?.[collectionSlug]
        
        if (!collectionHooks && !config.globalHooks) {
          return collection
        }

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
                
                if (config.globalHooks?.beforeChange) {
                  await processHook(
                    config.globalHooks.beforeChange,
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
                
                if (config.globalHooks?.afterChange) {
                  await processHook(
                    config.globalHooks.afterChange,
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
                
                if (config.globalHooks?.beforeDelete) {
                  await processHook(
                    config.globalHooks.beforeDelete,
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
                
                if (config.globalHooks?.afterDelete) {
                  await processHook(
                    config.globalHooks.afterDelete,
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
