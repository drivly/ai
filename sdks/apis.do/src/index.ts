export { API, createAPI } from './client'
export { CLI } from './cli'
export type { ClientOptions, ErrorResponse, ListResponse, QueryParams, Integration, Action } from './types'
export * from './types'

import { createAPI } from './client'
export const api = createAPI()
