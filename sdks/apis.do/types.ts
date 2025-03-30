/**
 * Type definitions for apis.do SDK
 */

export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}

export interface ListResponse<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasNextPage?: boolean
  }
}

export interface QueryParams {
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
  select?: string | string[]
  populate?: string | string[]
}


/**
 * Function definition
 */
export interface Function {
  id: string
  name: string
  type: 'Generation' | 'Code' | 'Human' | 'Agent'
  format: 'Object' | 'Text' | 'JSON' | 'Markdown'
  schema?: Record<string, any>
  prompt?: string
  code?: string
  createdAt: string
  updatedAt: string
}

/**
 * Workflow definition
 */
export interface Workflow {
  id: string
  name: string
  description?: string
  version?: string
  initialStep: string
  steps: Record<string, WorkflowStep>
  input?: Record<string, any>
  output?: Record<string, any>
  createdAt: string
  updatedAt: string
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
  name: string
  description?: string
  functions?: string[]
  workflows?: string[]
  capabilities?: string[]
  createdAt: string
  updatedAt: string
}


/**
 * Thing - Core data entity
 */
export interface Thing {
  id: string
  name: string
  sqid?: string
  hash?: string
  type?: string
  data?: Record<string, any>
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

/**
 * Noun - Category or type of Thing
 */
export interface Noun {
  id: string
  name: string
  description?: string
  properties?: Record<string, any>
  createdAt: string
  updatedAt: string
}

/**
 * Verb - Action form and relationship
 */
export interface Verb {
  id: string
  name: string
  description?: string
  past?: string
  present?: string
  future?: string
  createdAt: string
  updatedAt: string
}


/**
 * Trigger - Event that initiates a workflow
 */
export interface Trigger {
  id: string
  name: string
  description?: string
  type: string
  condition?: Record<string, any>
  workflow?: string
  createdAt: string
  updatedAt: string
}

/**
 * Search - Query operation for retrieving data
 */
export interface Search {
  id: string
  name: string
  description?: string
  collection: string
  query: Record<string, any>
  createdAt: string
  updatedAt: string
}

/**
 * Action - Task performed within workflows
 */
export interface Action {
  id: string
  subject: string
  verb: string
  object: string
  data?: Record<string, any>
  createdAt: string
  updatedAt: string
}


/**
 * Generation - Record of system state before/after an Action
 */
export interface Generation {
  id: string
  action?: string
  request?: Record<string, any>
  response?: Record<string, any>
  status: 'success' | 'error' | 'pending'
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
}


/**
 * Integration - External system connection
 */
export interface Integration {
  id: string
  name: string
  type: string
  config: Record<string, any>
  status: 'active' | 'inactive' | 'error'
  createdAt: string
  updatedAt: string
}

/**
 * IntegrationTrigger - Event from external system
 */
export interface IntegrationTrigger {
  id: string
  integration: string
  event: string
  condition?: Record<string, any>
  workflow?: string
  createdAt: string
  updatedAt: string
}

/**
 * IntegrationAction - Operation on external system
 */
export interface IntegrationAction {
  id: string
  integration: string
  action: string
  params?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}
