#!/usr/bin/env tsx
/**
 * This script syncs types from payload.types.ts to SDKs
 * Run this after `pnpm generate:types` to update SDK types
 * 
 * Note: Due to module augmentation issues, we manually define types
 * instead of importing directly from payload.types.ts
 */

import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const apisDoTypesPath = join(__dirname, '../sdks/apis.do/types.ts')

const typesContent = readFileSync(apisDoTypesPath, 'utf8')

const header = `/**
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
}`

const utilityTypesRegex = /export interface ErrorResponse[\s\S]*$/
const utilityTypes = typesContent.match(utilityTypesRegex)?.[0] || ''

writeFileSync(apisDoTypesPath, `${header}\n\n${utilityTypes}`, 'utf8')

console.log('✅ Updated apis.do/types.ts with compatible collection types')
