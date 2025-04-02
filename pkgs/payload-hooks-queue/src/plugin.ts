import type { CollectionConfig } from 'payload'
import { PayloadPlugin, HookHandlerOptions, TaskConfig, HookConfig, CollectionHookConfig, HookQueuePluginConfig } from './types'

/**
 * Helper to normalize hook config to standard format
 */
const normalizeHookConfig = (config: HookConfig): CollectionHookConfig => {
  if (typeof config === 'string') {
    return {
      afterChange: [{ slug: config }],
    }
  } else if (Array.isArray(config)) {
    return {
      afterChange: config.map((slug) => ({ slug })),
    }
  } else {
    const result: CollectionHookConfig = {}

    for (const hookType of ['beforeChange', 'afterChange', 'beforeDelete', 'afterDelete'] as const) {
      if (config[hookType]) {
        result[hookType] = config[hookType]!.map((item) => {
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
 * Process a hook by running the associated task
 */
const processHook = async (hooks: Array<string | TaskConfig> | undefined, options: HookHandlerOptions, payload: any) => {
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
            originalDoc: options.originalDoc,
          }

          return payload.db.tasks.run({
            slug,
            input: {
              ...input,
              ...(Object.keys(input).length === 0 ? options.data : {}),
              context,
            },
          })
        } catch (error) {
          console.error(`Error running task ${slug}:`, error)
        }
      }
    }),
  )
}

/**
 * Creates a Payload plugin that allows queueing tasks or workflows
 * from collection hooks with a simple API
 */
export const createHooksQueuePlugin = (config: HookQueuePluginConfig): PayloadPlugin => {
  const globalHooks = config.global ? normalizeHookConfig(config.global) : undefined

  return {
    collections: (incomingCollections: CollectionConfig[]) => {
      return incomingCollections.map((collection) => {
        const collectionSlug = collection.slug

        let collectionConfig = config.collections?.[collectionSlug]
        if (!collectionConfig && config.collections?.['*']) {
          collectionConfig = config.collections['*']
        }

        if (!collectionConfig && !globalHooks) {
          return collection
        }

        const collectionHooks = collectionConfig ? normalizeHookConfig(collectionConfig) : undefined

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
                      req,
                    },
                    req?.payload,
                  )
                }

                if (globalHooks?.beforeChange) {
                  await processHook(
                    globalHooks.beforeChange,
                    {
                      collection: collectionSlug,
                      operation: originalDoc ? 'update' : 'create',
                      data,
                      originalDoc,
                      req,
                    },
                    req?.payload,
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
                      req,
                    },
                    req?.payload,
                  )
                }

                if (globalHooks?.afterChange) {
                  await processHook(
                    globalHooks.afterChange,
                    {
                      collection: collectionSlug,
                      operation: previousDoc ? 'update' : 'create',
                      data: doc,
                      originalDoc: previousDoc,
                      req,
                    },
                    req?.payload,
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
                      req,
                    },
                    req?.payload,
                  )
                }

                if (globalHooks?.beforeDelete) {
                  await processHook(
                    globalHooks.beforeDelete,
                    {
                      collection: collectionSlug,
                      operation: 'delete',
                      data: { id },
                      req,
                    },
                    req?.payload,
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
                      req,
                    },
                    req?.payload,
                  )
                }

                if (globalHooks?.afterDelete) {
                  await processHook(
                    globalHooks.afterDelete,
                    {
                      collection: collectionSlug,
                      operation: 'delete',
                      data: { id },
                      originalDoc: doc,
                      req,
                    },
                    req?.payload,
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
