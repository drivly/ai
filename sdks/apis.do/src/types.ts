export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
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

export interface QueryParams {
  [key: string]: any
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
}
