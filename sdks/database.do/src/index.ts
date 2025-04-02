import { API, api as apisDoClient, ClientOptions, ListResponse, QueryParams } from 'apis.do'

import { DBOptions, SchemaDefinition, CollectionMethods, QueryOptions, CollectionData, DatabaseClient as DatabaseClientType } from './types'

export * from './types'

class CollectionHandler<T = CollectionData> implements CollectionMethods<T> {
  private api: API
  private collection: string

  constructor(api: API, collection: string) {
    this.api = api
    this.collection = collection
  }

  async find<T = CollectionData>(options: QueryOptions = {}): Promise<ListResponse<T>> {
    return this.api.list<T>(this.collection, options)
  }

  async findOne<T = CollectionData>(id: string): Promise<T> {
    return this.api.getById<T>(this.collection, id)
  }

  async create<T = CollectionData>(data: Partial<T>): Promise<T> {
    return this.api.create<T>(this.collection, data)
  }

  async update<T = CollectionData>(id: string, data: Partial<T>): Promise<T> {
    return this.api.update<T>(this.collection, id, data)
  }

  async delete<T = CollectionData>(id: string): Promise<T> {
    return this.api.remove<T>(this.collection, id)
  }

  async search<T = CollectionData>(query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    return this.api.search<T>(this.collection, query, options)
  }
}

export const DB = (options: DBOptions = {}): DatabaseClientType => {
  const { baseUrl, apiKey, ...schemaDefinitions } = options

  const apiOptions: ClientOptions = {
    baseUrl: baseUrl || 'https://database.do',
    apiKey,
  }

  const api = new API(apiOptions)

  return new Proxy({} as DatabaseClientType, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        const collectionName = prop === 'resources' ? 'things' : prop
        return new CollectionHandler(api, collectionName)
      }
      return target[prop as keyof typeof target]
    },
  })
}

export const db = DB()

export class DatabaseClient {
  private api: API
  public resources: CollectionMethods

  constructor(options: DBOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://database.do',
      apiKey: options.apiKey,
    }

    this.api = new API(apiOptions)

    this.resources = new CollectionHandler(this.api, 'things')
  }

  async find<T = CollectionData>(collection: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    const collectionName = collection === 'resources' ? 'things' : collection
    return this.api.list<T>(collectionName, options)
  }

  async findOne<T = CollectionData>(collection: string, id: string): Promise<T> {
    const collectionName = collection === 'resources' ? 'things' : collection
    return this.api.getById<T>(collectionName, id)
  }

  async create<T = CollectionData>(collection: string, data: Partial<T>): Promise<T> {
    const collectionName = collection === 'resources' ? 'things' : collection
    return this.api.create<T>(collectionName, data)
  }

  async update<T = CollectionData>(collection: string, id: string, data: Partial<T>): Promise<T> {
    const collectionName = collection === 'resources' ? 'things' : collection
    return this.api.update<T>(collectionName, id, data)
  }

  async delete<T = CollectionData>(collection: string, id: string): Promise<T> {
    const collectionName = collection === 'resources' ? 'things' : collection
    return this.api.remove<T>(collectionName, id)
  }

  async search<T = CollectionData>(collection: string, query: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    const collectionName = collection === 'resources' ? 'things' : collection
    return this.api.search<T>(collectionName, query, options)
  }
}

export default DB
