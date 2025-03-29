import { CollectionData, CollectionQuery, PayloadDB, PayloadInstance, PayloadClientOptions } from './types'

/**
 * Determines if a provided value is a payload instance
 * @param value - Value to check
 * @returns True if the value appears to be a payload instance
 */
const isPayloadInstance = (value: any): value is PayloadInstance => {
  // Simple check if it has at least one of the expected API methods
  // and is not just a config object with apiUrl property
  return (
    value &&
    typeof value === 'object' &&
    !('apiUrl' in value) &&
    (typeof value.find === 'function' ||
      typeof value.findByID === 'function' ||
      typeof value.create === 'function' ||
      typeof value.update === 'function' ||
      typeof value.delete === 'function')
  )
}

/**
 * Creates a proxy object for more concise collection operations
 * @param options - Payload CMS instance or configuration options
 * @returns A proxy object for database operations
 */
export const createPayloadClient = (options: PayloadClientOptions): PayloadDB => {
  // If options is a payload instance, use it directly
  const payload = isPayloadInstance(options) ? options : (options as any)
  return new Proxy(
    {},
    {
      get: (target, collectionName) => {
        const collection = String(collectionName)

        return new Proxy(
          {},
          {
            get: (_, method) => {
              const methodName = String(method)

              switch (methodName) {
                case 'find':
                  return (query: CollectionQuery = {}) =>
                    payload.find({
                      collection,
                      ...query,
                    })

                case 'findOne':
                  return (query: CollectionQuery = {}) =>
                    payload
                      .find({
                        collection,
                        limit: 1,
                        ...query,
                      })
                      .then((result: any) => result.docs?.[0] || null)

                case 'get':
                case 'findById':
                case 'findByID':
                  return (id: string, query: CollectionQuery = {}) =>
                    payload.findByID({
                      collection,
                      id,
                      ...query,
                    })

                case 'create':
                  return (data: CollectionData, query: CollectionQuery = {}) =>
                    payload.create({
                      collection,
                      data,
                      ...query,
                    })

                case 'update':
                  return (id: string, data: CollectionData, query: CollectionQuery = {}) =>
                    payload.update({
                      collection,
                      id,
                      data,
                      ...query,
                    })

                case 'upsert':
                case 'set':
                  return (id: string, data: CollectionData, query: CollectionQuery = {}) =>
                    payload.db.upsert({
                      collection,
                      where: { id: { equals: id } },
                      data,
                      ...query,
                    })

                case 'delete':
                  return (id: string, query: CollectionQuery = {}) =>
                    payload.delete({
                      collection,
                      id,
                      ...query,
                    })

                default:
                  throw new Error(`Method ${methodName} not implemented for collection ${collection}`)
              }
            },
          },
        )
      },
    },
  ) as PayloadDB
}
