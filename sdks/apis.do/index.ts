import { API } from './src/client'
import { CLI, CliOptions } from './src/cli'
import { ClientOptions, ErrorResponse, ListResponse, QueryParams } from './src/types'

// Export the API class
export { API } from './src/client'

// Export the CLI class and its types
export { CLI } from './src/cli'
export type { CliOptions } from './src/cli'

// Export the API instance
export const api = new API()
export const cli = new CLI()

// Explicitly export types from src/types
export type { ClientOptions, ErrorResponse, ListResponse, QueryParams }

// Export all from types.ts (includes Action)
export * from './types'
