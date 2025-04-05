/**
 * Type definitions for apis.do SDK
 *
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 */

/**
 * Function definition
 */
export interface Function {
  id: string
  name?: string
  type: 'Generation' | 'Code' | 'Human' | 'Agent'
  /**
   * Make this function available to other users
   */
  public?: boolean
  /**
   * Original function this was cloned from
   */
  clonedFrom?: string | Function
  /**
   * Monetization settings for this function
   */
  pricing?: {
    /**
     * Enable monetization for this function
     */
    isMonetized?: boolean
    /**
     * Price per use in USD cents (platform fee is 30% above LLM costs)
     */
    pricePerUse?: number
    /**
     * Stripe Product ID (auto-generated)
     */
    stripeProductId?: string
    /**
     * Stripe Price ID (auto-generated)
     */
    stripePriceId?: string
  }
  format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code'
  schema?: Record<string, any>
  prompt?: string
  code?: string
  updatedAt: string
  createdAt: string
}

/**
 * Workflow definition
 */
export interface Workflow {
  id: string
  name?: string
  description?: string
  type?: string
  code?: string
  /**
   * Make this workflow available to other users
   */
  public?: boolean
  /**
   * Original workflow this was cloned from
   */
  clonedFrom?: string | Workflow
  /**
   * Monetization settings for this workflow
   */
  pricing?: {
    /**
     * Enable monetization for this workflow
     */
    isMonetized?: boolean
    /**
     * Price per use in USD cents (platform fee is 30% above LLM costs)
     */
    pricePerUse?: number
    /**
     * Stripe Product ID (auto-generated)
     */
    stripeProductId?: string
    /**
     * Stripe Price ID (auto-generated)
     */
    stripePriceId?: string
  }
  updatedAt: string
  createdAt: string
}

/**
 * Workflow step configuration
 */
export interface WorkflowStep {
  name: string
  description?: string
  function?: string
  input?: Record<string, any>
  next?: string | Record<string, string>
  isFinal?: boolean
}

/**
 * Agent definition
 */
export interface Agent {
  id: string
  name?: string
  /**
   * Make this agent available to other users
   */
  public?: boolean
  /**
   * Original agent this was cloned from
   */
  clonedFrom?: string | Agent
  /**
   * Monetization settings for this agent
   */
  pricing?: {
    /**
     * Enable monetization for this agent
     */
    isMonetized?: boolean
    /**
     * Price per use in USD cents (platform fee is 30% above LLM costs)
     */
    pricePerUse?: number
    /**
     * Stripe Product ID (auto-generated)
     */
    stripeProductId?: string
    /**
     * Stripe Price ID (auto-generated)
     */
    stripePriceId?: string
  }
  updatedAt: string
  createdAt: string
}

/**
 * Thing - Core data entity
 */
export interface Thing {
  id: string
  name?: string
  sqid?: string
  hash?: string
  type?: string | Noun
  data?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * Noun - Category or type of Thing
 */
export interface Noun {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Verb - Action form and relationship
 */
export interface Verb {
  id: string
  action?: string
  act?: string
  activity?: string
  event?: string
  subject?: string
  object?: string
  inverse?: string
  updatedAt: string
  createdAt: string
}

/**
 * Trigger - Event that initiates a workflow
 */
export interface Trigger {
  id: string
  name?: string
  description?: string
  type?: string
  updatedAt: string
  createdAt: string
}

/**
 * Search - Query operation for retrieving data
 */
export interface Search {
  id: string
  name?: string
  description?: string
  collection?: string
  query?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * Action - Task performed within workflows
 */
export interface Action {
  id: string
  subject?: string | Thing
  verb?: string | Verb
  function?: string | Function
  object?: string | Thing
  hash?: string
  updatedAt: string
  createdAt: string
}

/**
 * Generation - Record of system state before/after an Action
 */
export interface Generation {
  id: string
  action?: string | Action
  request?: Record<string, any>
  response?: Record<string, any>
  status?: 'success' | 'error'
  duration?: number
  updatedAt: string
  createdAt: string
}

/**
 * Event - System event with timestamp and metadata
 */
export interface Event {
  id: string
  type: string
  data: Record<string, any>
  timestamp: string
  source?: string
  updatedAt: string
  createdAt: string
}

/**
 * Trace - Execution trace for debugging
 */
export interface Trace {
  id: string
  workflow?: string
  steps: Array<{
    step: string
    input: Record<string, any>
    output: any
    timestamp: string
  }>
  status: 'completed' | 'failed' | 'in_progress'
  updatedAt: string
  createdAt: string
}

/**
 * Integration - External system connection
 */
export interface Integration {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationTrigger - Event from external system
 */
export interface IntegrationTrigger {
  id: string
  display_name?: string
  description?: string
  payload?: Record<string, any>
  config?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationAction - Operation on external system
 */
export interface IntegrationAction {
  id: string
  displayName?: string
  description?: string
  parameters?: Record<string, any>
  response?: Record<string, any>
  updatedAt: string
  createdAt: string
}

export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}

/**
 * ListResponse - Paginated list response
 *
 * Represents paginated list responses
 */
export interface ListResponse<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasNextPage?: boolean
  }
}

/**
 * QueryParams - Parameters for querying collections
 *
 * Represents parameters for querying collections
 */
export interface QueryParams {
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
  select?: string | string[]
  populate?: string | string[]
}

/**
 * ClientOptions - Options for API client initialization
 *
 * Represents options for API client initialization
 */
export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}

/**
 * CollectionEndpoints - Type for collection-specific endpoints
 *
 * Represents collection-specific endpoints
 */
export interface CollectionEndpoints<T> {
  find: (params?: Record<string, any>, queryParams?: QueryParams) => Promise<ListResponse<T>>
  get: (id: string) => Promise<T>
  create: (data: Partial<T>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<T>
  search: (query: string, params?: QueryParams) => Promise<ListResponse<T>>
}
