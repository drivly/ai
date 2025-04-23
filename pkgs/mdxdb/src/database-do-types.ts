/**
 * Types copied from database.do to avoid project reference issues
 */

export interface CollectionData {
  id: string
  [key: string]: any
}

export interface ResourceData extends CollectionData {
  name: string
  description?: string
  type?: string
  url?: string
}

export interface ListResponse<T = CollectionData> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    hasNextPage: boolean
  }
}

export interface QueryOptions {
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
}

export interface CollectionMethods<T = CollectionData> {
  find: (options?: QueryOptions) => Promise<ListResponse<T>>
  findOne: (id: string) => Promise<T>
  create: (data: Partial<T>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<T>
  search: (query: string, options?: QueryOptions) => Promise<ListResponse<T>>
}

export interface DatabaseClient {
  resources: CollectionMethods<ResourceData>
  [collection: string]: CollectionMethods
}

export interface DBOptions {
  [key: string]: any
}
