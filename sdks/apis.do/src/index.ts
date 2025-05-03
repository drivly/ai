export { API } from './client'
export { CLI } from './cli'
export type { ClientOptions, ErrorResponse, ListResponse, QueryParams } from './types'
export * from './types'
export { COLLECTIONS, isCollection, type Collection } from './utils/collections'

import { API } from './client'
export const api = new API()
