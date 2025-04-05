import { api } from '../../apis.do'
import { IntegrationConfig, IntegrationConnection, Trigger, Action, Integration } from './types.js'

/**
 * Client for managing integrations between applications
 */
export const integrations = {
  /**
   * Connect to a service
   * @param service - The service to connect to
   * @param options - Connection options including authentication
   * @returns A connection to the service
   */
  connect: async (service: string, options: any): Promise<IntegrationConnection> => {
    return api.post(`/integrations/${service}/connect`, options)
  },

  /**
   * Create a trigger for integration events
   * @param config - Trigger configuration
   * @returns The created trigger
   */
  createTrigger: async (config: any): Promise<Trigger> => {
    return api.post('/integrations/triggers', config)
  },

  /**
   * Create a reusable action
   * @param config - Action configuration
   * @returns The created action
   */
  createAction: async (config: any): Promise<Action> => {
    return api.post('/integrations/actions', config)
  },

  /**
   * List available integrations
   * @returns Array of available integrations
   */
  list: async (): Promise<Integration[]> => {
    return api.get('/integrations')
  },

  /**
   * Get details about a specific integration
   * @param service - The service to get details for
   * @returns Integration details
   */
  get: async (service: string): Promise<Integration> => {
    return api.get(`/integrations/${service}`)
  },
}

/**
 * Define a custom integration configuration
 * @param config - Integration configuration
 * @returns The integration configuration
 */
export const createIntegration = (config: IntegrationConfig): IntegrationConfig => {
  return config
}

/**
 * Collection of event triggers for integration workflows
 */
export const triggers = {
  /**
   * List all triggers
   * @returns Array of triggers
   */
  list: async (): Promise<Trigger[]> => {
    return api.get('/integrations/triggers')
  },

  /**
   * Get a specific trigger
   * @param id - Trigger ID
   * @returns Trigger details
   */
  get: async (id: string): Promise<Trigger> => {
    return api.get(`/integrations/triggers/${id}`)
  },
}

/**
 * Collection of predefined operations for integrated services
 */
export const actions = {
  /**
   * List all actions
   * @returns Array of actions
   */
  list: async (): Promise<Action[]> => {
    return api.get('/integrations/actions')
  },

  /**
   * Get a specific action
   * @param id - Action ID
   * @returns Action details
   */
  get: async (id: string): Promise<Action> => {
    return api.get(`/integrations/actions/${id}`)
  },
}

export * from './types.js'
