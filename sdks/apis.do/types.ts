/**
 * Type definitions for apis.do SDK
 * 
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 * 
 * The apis.do SDK provides a unified API Gateway for all domains and services
 * in the .do ecosystem, enabling seamless integration with Functions.do,
 * Workflows.do, Agents.do, and other services.
 */

/**
 * Function definition
 * 
 * Represents an AI function with type, schema, and code/prompt
 */
export interface Function {
  id: string
  name?: string
  type: 'Generation' | 'Code' | 'Human' | 'Agent'
  format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code'
  schema?: Record<string, any>
  prompt?: string
  code?: string
  updatedAt: string
  createdAt: string
}

/**
 * Workflow definition
 * 
 * Represents a declarative state machine for orchestration
 */
export interface Workflow {
  id: string
  name?: string
  description?: string
  type?: string
  code?: string
  steps?: Record<string, WorkflowStep>
  updatedAt: string
  createdAt: string
}

/**
 * Workflow step configuration
 * 
 * Defines a single step within a workflow
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
 * 
 * Represents an autonomous digital worker
 */
export interface Agent {
  id: string
  name?: string
  role?: string
  job?: string
  instructions?: string
  tools?: string[]
  updatedAt: string
  createdAt: string
}

/**
 * Thing - Core data entity
 * 
 * Represents a core data entity with properties
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
 * 
 * Represents categories or types of Things
 */
export interface Noun {
  id: string
  name?: string
  description?: string
  updatedAt: string
  createdAt: string
}

/**
 * Verb - Action form and relationship
 * 
 * Represents action forms and relationships
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
 * 
 * Represents events that initiate workflows
 */
export interface Trigger {
  id: string
  name?: string
  description?: string
  type?: string
  condition?: Record<string, any>
  workflow?: string
  updatedAt: string
  createdAt: string
}

/**
 * Search - Query operation for retrieving data
 * 
 * Represents query operations for retrieving data
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
 * 
 * Represents tasks performed within workflows
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
 * 
 * Represents records of system state before/after an Action
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
 * 
 * Represents system events with timestamps and metadata
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
 * 
 * Represents execution traces for debugging
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
 * 
 * Represents external system connections
 */
export interface Integration {
  id: string
  name?: string
  type?: string
  config?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationTrigger - Event from external system
 * 
 * Represents events from external systems
 */
export interface IntegrationTrigger {
  id: string
  displayName?: string
  description?: string
  integration?: string | Integration
  payload?: Record<string, any>
  config?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationAction - Operation on external system
 * 
 * Represents operations on external systems
 */
export interface IntegrationAction {
  id: string
  displayName?: string
  description?: string
  integration?: string | Integration
  parameters?: Record<string, any>
  response?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * ErrorResponse - API error response
 * 
 * Represents API error responses
 */
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
