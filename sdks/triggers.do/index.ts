import { api } from 'apis.do'
import { Trigger, TriggerConfig } from './types.js'

/**
 * Client for managing workflow trigger events
 */
export const triggers = {
  /**
   * List all triggers
   * @param params - Query parameters
   * @returns Array of triggers
   */
  list: async (params?: Record<string, any>): Promise<Trigger[]> => {
    const response = await api.list<Trigger>('triggers', params)
    return response.data
  },

  /**
   * Get a specific trigger
   * @param id - Trigger ID
   * @returns Trigger details
   */
  get: async (id: string): Promise<Trigger> => {
    return api.getById<Trigger>('triggers', id)
  },

  /**
   * Create a new trigger
   * @param config - Trigger configuration
   * @returns The created trigger
   */
  create: async (config: TriggerConfig): Promise<Trigger> => {
    return api.create<Trigger>('triggers', config as unknown as Partial<Trigger>)
  },

  /**
   * Update an existing trigger
   * @param id - Trigger ID
   * @param config - Updated trigger configuration
   * @returns The updated trigger
   */
  update: async (id: string, config: Partial<TriggerConfig>): Promise<Trigger> => {
    return api.update<Trigger>('triggers', id, config as unknown as Partial<Trigger>)
  },

  /**
   * Delete a trigger
   * @param id - Trigger ID
   * @returns The deleted trigger
   */
  delete: async (id: string): Promise<Trigger> => {
    return api.remove<Trigger>('triggers', id)
  }
}

export * from './types.js'
