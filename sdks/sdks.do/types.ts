export interface ErrorResponse {
  errors?: Array<{
    message: string
    field?: string
  }>
}

export interface ListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface QueryParams {
  [key: string]: any
  limit?: number
  page?: number
  sort?: string
  where?: Record<string, any>
  depth?: number
}

export interface Package {
  id: string
  name: string
  package: any
  collections: Array<{
    collection: string
  }>
}

export interface PublishOptions {
  tag?: string
  dryRun?: boolean
}
