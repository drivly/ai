import { DatabaseClient, DBOptions } from './database-do-types.js'
import { MDXFileSystemHandler } from './fs-handler.js'
import { MDXCollectionHandler } from './collection.js'
import { MDXDBOptions } from './types.js'

/**
 * Creates a database client for MDX files
 * @param options Database options
 * @returns Database client
 */
export const DB = (options: MDXDBOptions = {}): DatabaseClient => {
  const { basePath = './content', fileExtension = '.mdx', createDirectories = true, ...schemaDefinitions } = options

  const fsHandler = new MDXFileSystemHandler(basePath, fileExtension, createDirectories)

  return new Proxy({} as DatabaseClient, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        return new MDXCollectionHandler(fsHandler, prop)
      }
      return target[prop as keyof typeof target]
    },
  })
}

export * from './types.js'
