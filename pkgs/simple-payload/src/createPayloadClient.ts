import { CollectionData, CollectionQuery, PayloadDB } from './types'

/**
 * Creates a proxy object for more concise collection operations
 * @param payload - Payload CMS instance
 * @returns A proxy object for database operations
 */
export const createPayloadClient = (payload: any): PayloadDB => {
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
