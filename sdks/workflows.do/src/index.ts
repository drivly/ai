/**
 * Workflows.do SDK
 * A framework for building, deploying, and managing enterprise-grade AI workflows
 */
export { WorkflowsClient } from './client'
export { default } from './client'

export interface AIConfig {
  [key: string]: (context: WorkflowContext) => Promise<any>
}

export interface WorkflowContext {
  ai: AICapabilities
  api: APIIntegrations
  db: DatabaseOperations
  event: any
}

export interface AICapabilities {
  [key: string]: (params: any) => Promise<any>
}

export interface APIIntegrations {
  [key: string]: any
}

export interface DatabaseOperations {
  [key: string]: any
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
