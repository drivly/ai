import { ApiClient } from './src/client.js'

export { ApiClient as API } from './src/client.js'
export const api = new ApiClient()
export type { ClientOptions } from './src/client.js'
export type { ErrorResponse, ListResponse, QueryParams } from './src/types.js'
export * from './types.js'
