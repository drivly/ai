import { DatabaseClient, DBOptions } from './database-do-types.js'
import { MDXFileSystemHandler } from './fs-handler.js'
import { PayloadHandler } from './payload-handler.js'
import { createCollectionHandler } from './collection-factory.js'
import { MDXDBOptions } from './types.js'

/**
 * Creates a database client for MDX files or Payload CMS
 * @param options Database options
 * @returns Database client
 */
export const DB = (options: MDXDBOptions = {}): DatabaseClient => {
  const { 
    backend = 'filesystem', 
    basePath = './content', 
    fileExtension = '.mdx', 
    createDirectories = true,
    payload,
    ...schemaDefinitions 
  } = options
  
  const handler = backend === 'filesystem'
    ? new MDXFileSystemHandler(basePath, fileExtension, createDirectories)
    : new PayloadHandler(payload)
  
  return new Proxy({} as DatabaseClient, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        return createCollectionHandler(handler, prop, backend)
      }
      return target[prop as keyof typeof target]
    },
  })
}

export * from './types.js'
export * from './collection-factory.js'
export * from './payload-handler.js'
export * from './payload-collection.js'
export * from './collections.js'

/**
 * Initialize a Payload DB client
 * @param config Payload config
 * @returns Database client
 */
export const initializePayloadDB = async (config: any): Promise<DatabaseClient> => {
  try {
    const { getPayload } = await import('payload')
    
    const payload = await getPayload({
      config,
      secret: process.env.PAYLOAD_SECRET || 'default-secret-key',
      local: true,
    })
    
    return DB({
      backend: 'payload',
      payload,
    })
  } catch (error) {
    console.error('Error initializing payload DB:', error)
    throw error
  }
}
