export interface ListResponse<T = any> {
  data: T[]
  totalDocs?: number
  limit?: number
  totalPages?: number
  page?: number
  pagingCounter?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export interface ErrorResponse {
  status: number
  message: string
  errors?: Record<string, { message: string }>
}

export interface QueryParams {
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
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
