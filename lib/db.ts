/**
 * Types for payload database operations
 */

export type CollectionQuery = Record<string, any>
export type CollectionData = Record<string, any>

export interface PayloadDBCollection {
  find: (query?: CollectionQuery) => Promise<any>
  findOne: (query?: CollectionQuery) => Promise<any> // Returns first item or null
  get: (id: string, query?: CollectionQuery) => Promise<any> // Alias for findById
  create: (data: CollectionData, query?: CollectionQuery) => Promise<any>
  update: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>
  upsert: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>
  set: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any> // Alias for update
  delete: (id: string, query?: CollectionQuery) => Promise<any>
}

export type PayloadDB = Record<string, PayloadDBCollection>

/**
 * Creates a database client from a Payload CMS instance
 * @param payload - Payload CMS instance
 * @returns PayloadDB instance with collection proxies
 */
export const createPayloadDB = (payload: any): PayloadDB => {
  const db: PayloadDB = {}

  const collections = payload.collections || {}

  for (const collectionName of Object.keys(collections)) {
    db[collectionName] = {
      find: async (query = {}) => {
        return payload.find({
          collection: collectionName,
          where: query,
        })
      },
      findOne: async (query = {}) => {
        const result = await payload.find({
          collection: collectionName,
          where: query,
          limit: 1,
        })
        return result.docs?.[0] || null
      },
      get: async (id, query = {}) => {
        return payload.findByID({
          collection: collectionName,
          id,
          ...query,
        })
      },
      create: async (data, query = {}) => {
        return payload.create({
          collection: collectionName,
          data,
          ...query,
        })
      },
      update: async (id, data, query = {}) => {
        return payload.update({
          collection: collectionName,
          id,
          data,
          ...query,
        })
      },
      upsert: async (id, data, query = {}) => {
        try {
          await payload.findByID({
            collection: collectionName,
            id,
          })
          return payload.update({
            collection: collectionName,
            id,
            data,
            ...query,
          })
        } catch (error) {
          return payload.create({
            collection: collectionName,
            data: { id, ...data },
            ...query,
          })
        }
      },
      set: async (id, data, query = {}) => {
        return payload.update({
          collection: collectionName,
          id,
          data,
          ...query,
        })
      },
      delete: async (id, query = {}) => {
        return payload.delete({
          collection: collectionName,
          id,
          ...query,
        })
      },
    }
  }

  return db
}

/**
 * Initialize a payload client from the root config
 * This is a simplified version that directly imports from the root config
 */
export const initializePayloadDB = async (): Promise<PayloadDB> => {
  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('../payload.config')

    const payload = await getPayload({ config })
    return createPayloadDB(payload)
  } catch (error) {
    console.error('Error initializing payload DB:', error)
    throw error
  }
}
