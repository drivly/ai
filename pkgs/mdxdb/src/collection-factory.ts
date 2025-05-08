import { MDXCollectionHandler } from './collection.js'
import { MDXFileSystemHandler } from './fs-handler.js'
import { PayloadCollectionHandler } from './payload-collection.js'
import { PayloadHandler } from './payload-handler.js'

/**
 * Creates a collection handler based on the backend type
 * @param handler Filesystem or Payload handler
 * @param collection Collection name
 * @param backend Backend type
 * @returns Collection handler
 */
export function createCollectionHandler(
  handler: MDXFileSystemHandler | PayloadHandler,
  collection: string,
  backend: 'filesystem' | 'payload'
) {
  if (backend === 'filesystem') {
    return new MDXCollectionHandler(handler as MDXFileSystemHandler, collection)
  } else {
    return new PayloadCollectionHandler(handler as PayloadHandler, collection)
  }
}
