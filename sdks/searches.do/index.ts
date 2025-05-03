import { client } from 'apis.do'
import { Search, SearchConfig } from './types'

/**
 * Client for managing search operations
 */
export const searches = {
  /**
   * List all searches
   * @param params - Query parameters
   * @returns Array of searches
   */
  list: async (params?: Record<string, any>): Promise<Search[]> => {
    const response = await client.list<Search>('searches', params)
    return response.data
  },

  /**
   * Get a specific search
   * @param id - Search ID
   * @returns Search details
   */
  get: async (id: string): Promise<Search> => {
    return api.getById<Search>('searches', id)
  },

  /**
   * Create a new search
   * @param config - Search configuration
   * @returns The created search
   */
  create: async (config: SearchConfig): Promise<Search> => {
    return api.create<Search>('searches', config as unknown as Partial<Search>)
  },

  /**
   * Update an existing search
   * @param id - Search ID
   * @param config - Updated search configuration
   * @returns The updated search
   */
  update: async (id: string, config: Partial<SearchConfig>): Promise<Search> => {
    return api.update<Search>('searches', id, config as unknown as Partial<Search>)
  },

  /**
   * Delete a search
   * @param id - Search ID
   * @returns The deleted search
   */
  delete: async (id: string): Promise<Search> => {
    return api.remove<Search>('searches', id)
  },

  /**
   * Execute a search query
   * @param id - Search ID
   * @param params - Additional query parameters
   * @returns Search results
   */
  execute: async (id: string, params?: Record<string, any>): Promise<any> => {
    return api.get<any>(`/v1/searches/${id}/execute`, params)
  },
}

export * from './types'
