/**
 * Type definitions for searches.do SDK
 */

import type { Search as ApiSearch } from 'apis.do/types'
import type { ClientOptions, ListResponse, QueryParams } from 'apis.do/types'

export type Search = ApiSearch

export interface SearchConfig {
  name: string
  query?: string
  searchType?: 'text' | 'vector' | 'hybrid'
  embedding?: Record<string, any>
}

export interface SearchClientOptions extends ClientOptions {
  baseUrl?: string
  apiKey?: string
}

export * from './src/constants'
