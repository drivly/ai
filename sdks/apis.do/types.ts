
/**
 * Type definitions for apis.do SDK
 * 
 * These types are imported directly from payload.types.ts
 */

/**
 * Function definition
 */
export type Function = {
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
 */
export type Workflow = {
  id: string
  name?: string
  description?: string
  type?: string
  code?: string
  updatedAt: string
  createdAt: string
}

/**
 * Workflow step configuration
 */
export type WorkflowStep = {
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
export type Agent = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Thing - Core data entity
 */
export type Thing = {
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
export type Noun = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Verb - Action form and relationship
 */
export type Verb = {
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
export type Trigger = {
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
export type Search = {
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
export type Action = {
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
export type Generation = {
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
export type Event = {
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
export type Trace = {
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
export type Integration = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationCategory - Category for integrations
 */
export type IntegrationCategory = {
  id: string
  category?: string
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationTrigger - Event from external system
 */
export type IntegrationTrigger = {
  id: string
  displayName?: string
  description?: string
  payload?: Record<string, any>
  config?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * IntegrationAction - Operation on external system
 */
export type IntegrationAction = {
  id: string
  displayName?: string
  description?: string
  parameters?: Record<string, any>
  response?: Record<string, any>
  updatedAt: string
  createdAt: string
}

/**
 * Connection - Link between systems
 */
export type Connection = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Experiment - Test of AI components
 */
export type Experiment = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Model - AI model configuration
 */
export type Model = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Setting - System configuration
 */
export type Setting = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Type - Data type definition
 */
export type Type = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Module - Code module
 */
export type Module = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Package - Deployable package
 */
export type Package = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Deployment - Instance of deployed code
 */
export type Deployment = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Benchmark - Performance measurement
 */
export type Benchmark = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Eval - Evaluation configuration
 */
export type Eval = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * EvalRun - Execution of an evaluation
 */
export type EvalRun = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * EvalResult - Result of an evaluation
 */
export type EvalResult = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Dataset - Collection of data for training/testing
 */
export type Dataset = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Error - System error record
 */
export type Error = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Queue - Task queue
 */
export type Queue = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Project - Group of related resources
 */
export type Project = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Task - Work item
 */
export type Task = {
  id: string
  title: string
  description?: string
  updatedAt: string
  createdAt: string
}

/**
 * Role - User role
 */
export type Role = {
  id: string
  name: string
  updatedAt: string
  createdAt: string
}

/**
 * Tag - Label for resources
 */
export type Tag = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Webhook - External notification endpoint
 */
export type Webhook = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * Apikey - Authentication key
 */
export type Apikey = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * User - System user
 */
export type User = {
  id: string
  email: string
  updatedAt: string
  createdAt: string
}

/**
 * PayloadJob - Background job
 */
export type PayloadJob = {
  id: string
  name?: string
  updatedAt: string
  createdAt: string
}

/**
 * PayloadLockedDocument - Document lock
 */
export type PayloadLockedDocument = {
  id: string
  updatedAt: string
  createdAt: string
}

/**
 * PayloadPreference - User preference
 */
export type PayloadPreference = {
  id: string
  updatedAt: string
  createdAt: string
}

/**
 * PayloadMigration - Database migration
 */
export type PayloadMigration = {
  id: string
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

export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}
