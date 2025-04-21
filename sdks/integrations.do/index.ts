import { API } from 'apis.do'; // Import the class
const api = new API(); // Instantiate locally
import { IntegrationConfig, IntegrationConnection, Trigger, Action, Integration, TriggerConfig, ActionConfig } from './types.js';
import { IntegrationAuthOptions } from './auth/types.js';

/**
 * Client for managing integrations between applications.
 * Interacts with backend API endpoints that handle the actual integration logic.
 */
export const integrations = {
  /**
   * Initiate a connection to a service.
   * This typically involves redirecting the user for OAuth or validating an API key via the backend.
   * The backend handles the auth flow and returns connection details upon success.
   * @param service - The service identifier (e.g., 'github', 'slack')
   * @param options - Authentication options (OAuth details, API key, etc.)
   * @returns A promise resolving to the connection details once established. The generic T allows specifying expected details.
   */
  connect: async <T = Record<string, any>>(
    service: string, 
    options: IntegrationAuthOptions
  ): Promise<IntegrationConnection<T>> => {
    return api.post<IntegrationConnection<T>>(`/integrations/${service}/connect`, options);
  },

  /**
   * Create a trigger configuration. The backend handles webhook setup/scheduling.
   * @param config - Trigger configuration (type, source, event, filter, target)
   * @returns The created trigger definition with its ID and status
   */
  createTrigger: async (config: TriggerConfig): Promise<Trigger> => {
    return api.post<Trigger>('/integrations/triggers', config);
  },

  /**
   * Create a reusable action configuration. The backend stores this definition.
   * @param config - Action configuration (name, description, source, operation, schema)
   * @returns The created action definition with its ID
   */
  createAction: async (config: ActionConfig): Promise<Action> => {
    return api.post<Action>('/integrations/actions', config);
  },

  /**
   * List available integration definitions (e.g., GitHub, Slack).
   * @returns Array of available integration definitions
   */
  list: async (): Promise<Integration[]> => {
    return api.get<Integration[]>('/integrations');
  },

  /**
   * Get details about a specific integration definition.
   * @param service - The service identifier (e.g., 'github')
   * @returns Integration definition details
   */
  get: async (service: string): Promise<Integration> => {
    return api.get<Integration>(`/integrations/${service}`);
  },

  /**
   * Execute a predefined action by its ID.
   * @param actionId - The ID of the action to execute
   * @param inputs - The input data matching the action's inputSchema
   * @returns The result of the action execution from the backend task
   */
  executeAction: async <ResultType = any>(actionId: string, inputs: Record<string, any>): Promise<ResultType> => {
    return api.post<ResultType>(`/integrations/actions/${actionId}/execute`, inputs);
  },

  /**
   * Enable a trigger by its ID. Calls the backend API.
   * @param triggerId - The ID of the trigger to enable
   * @returns A promise resolving when the operation is complete (typically void or updated trigger status)
   */
  enableTrigger: async (triggerId: string): Promise<Trigger> => {
    return api.post<Trigger>(`/integrations/triggers/${triggerId}/enable`, {});
  },

  /**
   * Disable a trigger by its ID. Calls the backend API.
   * @param triggerId - The ID of the trigger to disable
   * @returns A promise resolving when the operation is complete (typically void or updated trigger status)
   */
  disableTrigger: async (triggerId: string): Promise<Trigger> => {
    return api.post<Trigger>(`/integrations/triggers/${triggerId}/disable`, {});
  },


  /**
   * List active connections for the authenticated user.
   * @returns Array of active integration connections
   */
  listConnections: async <T = Record<string, any>>(): Promise<IntegrationConnection<T>[]> => {
    return api.get<IntegrationConnection<T>[]>('/integrations/connections'); 
  },

  /**
   * Get details of a specific connection.
   * @param connectionId - The ID of the connection
   * @returns Connection details
   */
  getConnection: async <T = Record<string, any>>(connectionId: string): Promise<IntegrationConnection<T>> => {
    return api.get<IntegrationConnection<T>>(`/integrations/connections/${connectionId}`);
  },

  /**
   * Delete a connection.
   * @param connectionId - The ID of the connection to delete
   * @returns void or confirmation
   */
  deleteConnection: async (connectionId: string): Promise<void> => {
    return api.post<void>(`/integrations/connections/${connectionId}`, { _method: 'DELETE' });
  },
};

/**
 * Define a custom integration configuration (likely for internal platform use, not SDK client).
 * @param config - Integration configuration
 * @returns The integration configuration
 */
export const createIntegration = (config: IntegrationConfig): IntegrationConfig => {
  console.warn('createIntegration is likely intended for server-side definition, not SDK client usage.');
  return config;
};

/**
 * Collection of helper methods for managing event triggers.
 */
export const triggers = {
  /**
   * List all configured triggers for the user/account.
   * @returns Array of triggers
   */
  list: async (): Promise<Trigger[]> => {
    return api.get<Trigger[]>('/integrations/triggers');
  },

  /**
   * Get a specific trigger by its ID.
   * @param id - Trigger ID
   * @returns Trigger details
   */
  get: async (id: string): Promise<Trigger> => {
    return api.get<Trigger>(`/integrations/triggers/${id}`);
  },

  /**
   * Delete a trigger by its ID.
   * @param id - Trigger ID
   * @returns void or confirmation
   */
  delete: async (id: string): Promise<void> => {
    return api.post<void>(`/integrations/triggers/${id}`, { _method: 'DELETE' });
  },
  
};

/**
 * Collection of helper methods for managing predefined actions.
 */
export const actions = {
  /**
   * List all configured actions for the user/account.
   * @returns Array of actions
   */
  list: async (): Promise<Action[]> => {
    return api.get<Action[]>('/integrations/actions');
  },

  /**
   * Get a specific action by its ID.
   * @param id - Action ID
   * @returns Action details
   */
  get: async (id: string): Promise<Action> => {
    return api.get<Action>(`/integrations/actions/${id}`);
  },

  /**
   * Delete an action by its ID.
   * @param id - Action ID
   * @returns void or confirmation
   */
  delete: async (id: string): Promise<void> => {
    return api.post<void>(`/integrations/actions/${id}`, { _method: 'DELETE' });
  },

};

export * from './types.js';
export * from './auth/types.js';
