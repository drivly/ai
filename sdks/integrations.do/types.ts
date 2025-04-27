import { IntegrationAuthOptions } from './auth/types.js'

/**
 * Integration interface (Definition of an available integration)
 */
export interface Integration {
  /** Integration ID (e.g., 'github', 'slack') */
  id: string
  /** Integration name */
  name: string
  /** Integration description */
  description: string
  /** Integration status (availability) */
  status: 'active' | 'inactive'
  /** Authentication methods supported */
  auth?: IntegrationAuthOptions['type'][]
  /** Logo URL or identifier */
  logo?: string
}

/**
 * Integration configuration interface (Used for defining a new integration type, less relevant for SDK usage)
 */
export interface IntegrationConfig {
  /** Name of the integration */
  name: string
  /** Description of the integration */
  description: string
  /** Authentication methods required/supported by the integration */
  auth?: IntegrationAuthOptions['type'][] // e.g., ['oauth', 'apiKey']
  /** Available operations (defined for clarity, execution handled by backend) */
  operations?: Record<
    string,
    {
      description: string
      inputSchema: Record<string, string>
    }
  >
  /** Event triggers (defined for clarity, setup handled by backend) */
  triggers?: Record<
    string,
    {
      description: string
    }
  >
}

/**
 * Represents an active connection to an integration service.
 * The generic type T can represent service-specific methods/properties if known,
 * but the core connection details are standard.
 */
export interface IntegrationConnection<T = Record<string, any>> {
  /** Connection ID */
  id: string
  /** Service name (matches Integration ID) */
  service: string
  /** Connection status */
  status: 'active' | 'inactive' | 'error'
  /** Basic authentication details (sensitive parts omitted) */
  auth: {
    type: IntegrationAuthOptions['type']
    expiresAt?: string // Relevant for OAuth
    accountName?: string
  }
  /** Placeholder for potential service-specific details returned by the backend */
  details?: T
}

/**
 * Configuration for creating a trigger. Passed to the backend.
 */
export interface TriggerConfig {
  type: 'webhook' | 'scheduled' | 'manual' // Add others as needed
  source: string // Service name (matches Integration ID)
  event: string // Specific event identifier (e.g., 'push', 'issue.created')
  filter?: Record<string, any> // Criteria to filter events (e.g., { branch: 'main' })
  targetActionId?: string // ID of an Action collection item?
  workflowId?: string
}

/**
 * Represents a configured trigger.
 */
export interface Trigger {
  /** Trigger ID */
  id: string
  /** Trigger type */
  type: TriggerConfig['type']
  /** Source service */
  source: string
  /** Event name */
  event: string
  /** Filter criteria */
  filter?: Record<string, any>
  /** Status */
  status: 'enabled' | 'disabled' | 'error'
  /** Associated workflow or action ID */
  targetActionId?: string
  workflowId?: string
  /** Last execution time or status */
  lastExecution?: {
    timestamp: string
    status: 'success' | 'failure'
    error?: string
  }
}

/**
 * Configuration for creating an action. Passed to the backend.
 */
export interface ActionConfig {
  name: string
  description: string
  source: string // Service name (matches Integration ID)
  operation: string // e.g., 'createIssue', 'sendMessage'
  inputSchema: Record<string, string> // Simple key: description schema for now
}

/**
 * Represents a configured action.
 */
export interface Action {
  /** Action ID */
  id: string
  /** Action name */
  name: string
  /** Action description */
  description: string
  /** Source service */
  source: string
  /** Operation name */
  operation: string
  /** Input schema */
  inputSchema: Record<string, string>
}
