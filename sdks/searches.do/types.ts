/**
 * Type definitions for searches.do SDK
 */

import { Search as ApiSearch } from 'apis.do'

export type Search = ApiSearch

export interface SearchConfig {
  name: string
  query?: string
  searchType?: 'text' | 'vector' | 'hybrid'
  embedding?: Record<string, any>
}

export * from './src/constants.js'
