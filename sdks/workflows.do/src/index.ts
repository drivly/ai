/**
 * Workflows.do SDK
 * A framework for building, deploying, and managing enterprise-grade AI workflows
 */
export { WorkflowsClient } from './client'
export { default } from './client'

export interface AIConfig {
  /**
   * AI function definition with a single parameter containing both args and context properties
   * This matches the usage pattern in examples like writeBook.js
   */
  [key: string]: (params: { args: any; ai: AICapabilities<any>; api: APIIntegrations<any>; db: DatabaseOperations<any>; event?: any }) => Promise<any>
}

export interface WorkflowContext<AI = any, API = any, DB = any, Event = any> {
  /**
   * AI capabilities for intelligent processing
   * Uses Proxy under the hood to dynamically handle any method call
   */
  ai: AICapabilities<AI>

  /**
   * API integrations for external services
   * Uses Proxy under the hood to dynamically handle any property access
   */
  api: APIIntegrations<API>

  /**
   * Database operations for data persistence
   * Uses Proxy under the hood to dynamically handle any property access
   */
  db: DatabaseOperations<DB>

  /**
   * Event data that triggered the workflow
   * This can vary based on the event type
   */
  event: Event & {
    /**
     * Generic event properties
     */
    [key: string]: any

    /**
     * Common user event properties
     */
    name?: string
    email?: string
    company?: string

    /**
     * Customer feedback properties
     */
    customerId?: string
    feedback?: string
  }
}

export interface AICapabilities<T = any> {
  /**
   * Generic AI function call with any parameters
   * Uses Proxy under the hood to dynamically handle any method call
   */
  [key: string]: (params: any) => Promise<T>

  /**
   * Example: Research a company and return detailed information
   */
  researchCompany: (params: { company: string }) => Promise<T>

  /**
   * Example: Summarize content with a specified length
   */
  summarizeContent: (params: { length: string; [key: string]: any }) => Promise<T>

  /**
   * Example: Define a function based on provided arguments
   */
  defineFunction: (params: any) => Promise<T>
}

export interface APIIntegrations<T = any> {
  /**
   * Generic API integration
   * Uses Proxy under the hood to dynamically handle any property access
   */
  [key: string]: any

  /**
   * Example: Apollo API for searching contact information
   */
  apollo: {
    search: (params: { name?: string; email?: string; company?: string }) => Promise<T>
  }

  /**
   * Example: Slack API for posting messages
   */
  slack: {
    postMessage: (params: { channel: string; content: any }) => Promise<T>
  }
}

export interface DatabaseOperations<T = any> {
  /**
   * Generic database collection operations
   * Uses Proxy under the hood to dynamically handle any property access
   */
  [key: string]: any

  /**
   * Example: Users collection operations
   */
  users: {
    /**
     * Create a new user record
     */
    create: (params: { name: string; email: string; company?: string; [key: string]: any }) => Promise<T>

    /**
     * Find a user by ID
     */
    findById: (id: string) => Promise<T>

    /**
     * Find users by query
     */
    find: (query: any) => Promise<T[]>

    /**
     * Update a user record
     */
    update: (id: string, data: any) => Promise<T>

    /**
     * Delete a user record
     */
    delete: (id: string) => Promise<T>
  }
}

export interface WorkflowConfig {
  name: string
  description?: string
  steps: Record<string, WorkflowStep>
  triggers?: string[]
  timeout?: number
}

export interface WorkflowStep {
  type?: 'action' | 'decision' | 'parallel' | 'wait' | 'terminal'
  action?: string
  next?: string | Record<string, string>
  onError?: string
  retry?: RetryConfig
  branches?: Record<string, string>
  joinCondition?: 'all' | 'any' | 'n' | ((results: any) => boolean)
  result?: any
}

export interface RetryConfig {
  maxAttempts: number
  backoff: 'fixed' | 'exponential' | 'linear'
  initialDelay: number
}

export interface IntegrationConfig {
  name: string
  actions: Record<string, (params: any) => Promise<any>>
  events?: string[]
}

/**
 * Create an AI-powered workflow
 * @param config The workflow configuration
 * @returns The configured workflow
 */
export function AI(config: AIConfig) {
  return config
}

/**
 * Define a new workflow
 * @param config The workflow configuration
 * @returns The configured workflow
 */
export function defineWorkflow(config: WorkflowConfig) {
  return config
}

/**
 * Create an integration with external services
 * @param config The integration configuration
 * @returns The configured integration
 */
export function defineIntegration(config: IntegrationConfig) {
  return config
}

/**
 * Define an event trigger for workflows
 * @param config The trigger configuration
 * @returns The configured trigger
 */
export function defineTrigger(config: any) {
  return config
}

/**
 * Create a reusable action for workflow steps
 * @param config The action configuration
 * @returns The configured action
 */
export function defineAction(config: any) {
  return config
}
