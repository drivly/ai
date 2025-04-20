import { API, createAPI } from './src/client'
export { API, createAPI } from './src/client'

import { CLI, CliOptions } from './src/cli'
export { CLI } from './src/cli'
export type { CliOptions } from './src/cli'

export const api = createAPI()
export const cli = new CLI()

export type { ClientOptions, ErrorResponse, ListResponse, QueryParams, Integration, Action } from './src/types'

// export * from './types'

export * from './src/bin'
