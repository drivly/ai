import { client } from 'apis.do'
import { Action, ActionConfig } from './types'

let ComposioActionTypes: any
try {
  ComposioActionTypes = require('./generated/types').ComposioActionTypes
} catch (e) {
  ComposioActionTypes = {}
}

type IntegrationsType = {
  [integrationName: string]: {
    [actionName: string]: (params: Record<string, any>) => Promise<any>
  }
}

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
    const response = await client.list<Action>('actions', params)
    return response.data
  },

  /**
   * Get a specific action
   * @param id - Action ID
   * @returns Action details
   */
  get: async (id: string): Promise<Action> => {
    return client.getById<Action>('actions', id)
  },

  /**
   * Create a new action
   * @param config - Action configuration
   * @returns The created action
   */
  create: async (config: ActionConfig): Promise<Action> => {
    return client.create<Action>('actions', config as unknown as Partial<Action>)
  },

  /**
   * Update an existing action
   * @param id - Action ID
   * @param config - Updated action configuration
   * @returns The updated action
   */
  update: async (id: string, config: Partial<ActionConfig>): Promise<Action> => {
    return client.update<Action>('actions', id, config as unknown as Partial<Action>)
  },

  /**
   * Delete an action
   * @param id - Action ID
   * @returns The deleted action
   */
  delete: async (id: string): Promise<Action> => {
    return client.remove<Action>('actions', id)
  },

  /**
   * Execute an action
   * @param id - Action ID or dot notation (e.g., 'github.createIssue')
   * @param params - Execution parameters
   * @returns Action execution result
   */
  execute: async <T = any>(id: string, params?: Record<string, any>): Promise<T> => {
    return client.post<T>(`/v1/actions/${id}/execute`, params)
  },

  /**
   * Integration actions with typed interfaces
   * Populated dynamically at runtime
   */
  integrations: {} as IntegrationsType,
}

const handler = {
  get: (target: any, prop: string) => {
    if (!(prop in target)) {
      target[prop] = new Proxy(
        {},
        {
          get: (actionTarget: any, actionProp: string) => {
            if (!(actionProp in actionTarget)) {
              actionTarget[actionProp] = (params: any) => {
                return actions.execute(`${prop}.${actionProp}`, params)
              }
            }
            return actionTarget[actionProp]
          },
        },
      )
    }
    return target[prop]
  },
}

actions.integrations = new Proxy({}, handler) as IntegrationsType

export * from './types'
