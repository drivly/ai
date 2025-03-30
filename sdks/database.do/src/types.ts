export type FieldType = 'text' | 'richtext' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'tags[]' | string // For relationships and custom types

export type SchemaDefinition = {
  [collection: string]: {
    [field: string]: FieldType
  }
}

export type CollectionData = Record<string, any>

export interface QueryOptions {
  where?: Record<string, any>
  sort?: string | string[]
  limit?: number
  page?: number
  select?: string | string[]
  populate?: string | string[]
}

export interface DBOptions {
  baseUrl?: string
  apiKey?: string
  [collection: string]: any
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
  [collection: string]: CollectionMethods
}

export interface ListResponse<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasNextPage?: boolean
  }
}

export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}
