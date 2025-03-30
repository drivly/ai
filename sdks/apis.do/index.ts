import { ApiClient as API } from './src/client'

export { ApiClient as API } from './src/client'
export const api = new API()
export type { ClientOptions } from './src/client'
export type { ErrorResponse, ListResponse, QueryParams } from './src/types'
export * from './types'
