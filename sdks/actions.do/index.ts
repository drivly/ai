import { api } from 'apis.do'
import { Action, ActionConfig } from './types.js'

/**
 * Client for managing workflow actions
 */
export const actions = {
  /**
   * List all actions
   * @param params - Query parameters
   * @returns Array of actions
   */
  list: async (params?: Record<string, any>): Promise<Action[]> => {
    const response = await api.list<Action>('actions', params)
    return response.data
  },

  /**
   * Get a specific action
   * @param id - Action ID
   * @returns Action details
   */
  get: async (id: string): Promise<Action> => {
    return api.getById<Action>('actions', id)
  },

  /**
   * Create a new action
   * @param config - Action configuration
   * @returns The created action
   */
  create: async (config: ActionConfig): Promise<Action> => {
    return api.create<Action>('actions', config as unknown as Partial<Action>)
  },

  /**
   * Update an existing action
   * @param id - Action ID
   * @param config - Updated action configuration
   * @returns The updated action
   */
  update: async (id: string, config: Partial<ActionConfig>): Promise<Action> => {
    return api.update<Action>('actions', id, config as unknown as Partial<Action>)
  },

  /**
   * Delete an action
   * @param id - Action ID
   * @returns The deleted action
   */
  delete: async (id: string): Promise<Action> => {
    return api.remove<Action>('actions', id)
  },

  /**
   * Execute an action
   * @param id - Action ID
   * @param params - Execution parameters
   * @returns Action execution result
   */
  execute: async (id: string, params?: Record<string, any>): Promise<any> => {
    return api.post<any>(`/api/actions/${id}/execute`, params)
  },
}

export * from './types.js'
