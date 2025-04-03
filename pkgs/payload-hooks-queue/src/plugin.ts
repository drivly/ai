import type { CollectionConfig } from 'payload'
import { waitUntil } from '@vercel/functions'
import { 
  PayloadPlugin, 
  HookHandlerOptions, 
  TaskConfig, 
  HookConfig, 
  CollectionHookConfig,
  HookQueuePluginConfig 
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
      afterChange: config.map(slug => ({ slug }))
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
      const { slug, input = {}, condition } = config
      
      if (condition) {
        if (typeof condition === 'string') {
          const { data, originalDoc } = options
          const doc = options.data // For afterChange hooks
          
          const evalContext = { 
            data, 
            doc, 
            originalDoc,
            id: doc?.id,
            collection: options.collection,
            operation: options.operation
          }
          
          try {
            const evalFn = new Function(...Object.keys(evalContext), `
              try {
                return (${condition});
              } catch (e) {
                console.error('Error in condition evaluation:', e);
                return false;
              }
            `)
            
            const conditionMet = evalFn(...Object.values(evalContext))
            
            if (!conditionMet) {
              console.log(`Condition not met for task ${slug}: ${condition}`)
              return // Skip this hook if condition is not met
            }
          } catch (error) {
            console.error(`Error evaluating condition "${condition}":`, error)
            return // Skip on error
          }
        } else if (typeof condition === 'function') {
          try {
            const conditionMet = condition(options)
            if (!conditionMet) {
              console.log(`Function condition not met for task ${slug}`)
              return // Skip this hook if condition is not met
            }
          } catch (error) {
            console.error(`Error executing condition function:`, error)
            return // Skip on error
          }
        }
      }
      
      if (payload?.db?.tasks) {
        try {
          const context = {
            collection: options.collection,
            operation: options.operation,
            data: options.data,
            originalDoc: options.originalDoc
          }
          
          const processedInput: Record<string, any> = {}
          
          for (const [key, value] of Object.entries(input)) {
            if (typeof value === 'string' && (value.startsWith('data.') || value.startsWith('doc.'))) {
              const parts = value.split('.')
              const source = parts[0] === 'data' ? options.data : options.data // Both refer to the same in our context
              
              let current = source
              for (let i = 1; i < parts.length; i++) {
                if (current && typeof current === 'object') {
                  current = current[parts[i]]
                } else {
                  current = undefined
                  break
                }
              }
              
              processedInput[key] = current
            } else {
              processedInput[key] = value
            }
          }
          
          return payload.db.tasks.run({
            slug,
            input: {
              ...processedInput,
              ...(Object.keys(processedInput).length === 0 ? options.data : {}),
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
 * Creates a Payload plugin that allows queueing tasks or workflows
 * from collection hooks with a simple API
 */
export const createHooksQueuePlugin = (config: HookQueuePluginConfig) => {
  const globalHooks = config.global ? normalizeHookConfig(config.global) : undefined
  
  return (incomingConfig: any) => {
    const collections = incomingConfig.collections || [];
    
    const processedCollections = collections.map((collection: CollectionConfig) => {
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
                    req
                  },
                  req?.payload
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
              
              if (globalHooks?.afterChange) {
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
              
              if (globalHooks?.beforeDelete) {
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
              
              if (globalHooks?.afterDelete) {
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
    });
    
    return {
      ...incomingConfig,
      collections: processedCollections,
    };
  };
}

/**
 * Convenience method for defining hooks directly in collection files
 * @example
 * // Simple usage
 * hooks: on('afterChange', 'processCodeFunction')
 * 
 * // With condition
 * hooks: on('afterChange', 'processCodeFunction', { condition: 'doc.type === "Code"' })
 * 
 * // Multiple hooks for the same event
 * hooks: on('afterChange', [
 *   'processCodeFunction',
 *   { slug: 'generateFunctionExamples', condition: '!doc.examples || doc.examples.length === 0' }
 * ])
 * 
 * // Multiple hook types
 * hooks: {
 *   ...on('beforeChange', 'validateData'),
 *   ...on('afterChange', 'processData')
 * }
 */
export function on(
  hookType: 'beforeChange' | 'afterChange' | 'beforeDelete' | 'afterDelete',
  tasks: string | TaskConfig | Array<string | TaskConfig>,
  options?: { condition?: string | ((options: HookHandlerOptions) => boolean) }
): Record<string, any> {
  const normalizedTasks = Array.isArray(tasks) ? tasks : [tasks];
  
  return {
    [hookType]: [
      async (args: any) => {
        const { req } = args;
        const { payload } = req;
        
        await Promise.all(
          normalizedTasks.map(async (task) => {
            const taskConfig = typeof task === 'string' 
              ? { slug: task, ...(options?.condition ? { condition: options.condition } : {}) } 
              : { ...task, ...(options?.condition && !task.condition ? { condition: options.condition } : {}) };
            
            try {
              const job = await payload.jobs.queue({
                task: taskConfig.slug,
                input: {
                  ...(typeof taskConfig.input === 'object' ? taskConfig.input : {}),
                  ...args,
                }
              });
              
              console.log(`Queued task ${taskConfig.slug}`, job);
              if (typeof waitUntil === 'function') {
                waitUntil(payload.jobs.runByID({ id: job.id }));
              }
            } catch (error) {
              console.error(`Error queueing task ${taskConfig.slug}:`, error);
            }
          })
        );
        
        return args.data || args.doc;
      }
    ]
  };
}
