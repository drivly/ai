import { API } from './src/client'
export { API } from './src/client'

import { CLI, CliOptions } from './src/cli'
export { CLI } from './src/cli'
export type { CliOptions } from './src/cli'

import { createApiProxy } from './src/proxy'

export const apiClient = new API()
export const api = createApiProxy()
export const cli = new CLI()

export type { ClientOptions, ErrorResponse, ListResponse, QueryParams } from './src/types'

export * from './types'

export * from './src/index'

export * from './src/bin'
