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
/**
 * Client configuration options
 */
export interface ClientOptions {
  /**
   * Base URL for API requests
   * @default 'https://api.do'
   */
  baseUrl?: string
  /**
   * API key for authentication
   */
  apiKey?: string
  /**
   * Custom fetch implementation
   */
  fetch?: typeof fetch
  /**
   * Skip SSL certificate validation (only for testing)
   */
  ignoreSSLErrors?: boolean
  /**
   * Additional headers to include with requests
   */
  headers?: Record<string, string>
}
