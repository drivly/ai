import { API } from './src/client.js'
import { CLI, CliOptions } from './src/cli.js'

// Export the API class
export { API } from './src/client.js'

// Export the CLI class and its types
export { CLI } from './src/cli.js'
export type { CliOptions } from './src/cli.js'

// Export the API instance
export const api = new API()

// Export other types
export type { ClientOptions } from './src/types.js'
export type { ErrorResponse, ListResponse, QueryParams } from './src/types.js'

// Export all types from types.ts
export * from './types.js'
