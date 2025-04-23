/**
 * Type definitions for workflows.do SDK
 */

/**
 * AI Function type
 */
export type AIFunction<TInput = any, TOutput = any> = {
  (input: TInput, config?: any): Promise<TOutput>
}

/**
 * AI Function Schema
 * Defines the expected input and output structure for an AI function
 */
export type AIFunctionSchema<TOutput = any> = Record<string, any> & {
  __output?: TOutput
}

/**
 * Helper type to convert schema to output type
 */
export type SchemaToOutput<T extends Record<string, any>> = T extends { __output?: infer U } ? U : T

/**
 * Database access interface
 */
export interface DatabaseAccess {
  [collection: string]: {
    create: (data: Record<string, any>) => Promise<{ url: string } & Record<string, any>>
    findOne: (query: Record<string, any>) => Promise<Record<string, any>>
    find: (query: Record<string, any>) => Promise<Array<Record<string, any>>>
    update: (id: string, data: Record<string, any>) => Promise<Record<string, any>>
    delete: (id: string) => Promise<void>
    [method: string]: (...args: any[]) => Promise<any>
  }
}

/**
 * API access interface
 */
export interface APIAccess {
  [service: string]: {
    [method: string]: (...args: any[]) => Promise<any>
  }
}

/**
 * AI Context provided to event handlers
 */
export interface AIContext {
  /** AI functions defined in the schema */
  ai: Record<string, AIFunction>
  /** External API integrations */
  api: APIAccess
  /** Database access for storing and retrieving data */
  db: DatabaseAccess
  /** Durable Objects access */
  do: Record<string, any>
}

/**
 * Event handler function type
 */
export type AIEventHandler<TEvent = any, TResult = any> = (event: TEvent, context: AIContext) => Promise<TResult>

/**
 * AI Configuration object
 * Contains event handlers and function schemas
 */
export interface AIConfig {
  [key: string]: AIEventHandler | AIFunctionSchema
}

/**
 * AI Instance returned by AI() function
 */
export interface AIInstance {
  [key: string]: AIFunction
}

/**
 * Workflow step configuration
 */
export interface WorkflowStep {
  /** Step name/identifier */
  name: string
  /** Step description */
  description?: string
  /** Function to execute for this step */
  function?: string | AIFunction
  /** Input parameters for the function */
  input?: Record<string, any>
  /** Next step to execute based on output conditions */
  next?: string | Record<string, string>
  /** Whether this step is the final step in the workflow */
  isFinal?: boolean
}

/**
 * Workflow configuration
 */
export interface Workflow {
  /** Workflow name */
  name: string
  /** Workflow description */
  description?: string
  /** Workflow version */
  version?: string
  /** Initial step to execute */
  initialStep: string
  /** Steps in the workflow */
  steps: Record<string, WorkflowStep>
  /** Input schema for the workflow */
  input?: Record<string, any>
  /** Output schema for the workflow */
  output?: Record<string, any>
}

/**
 * Workflow execution context
 */
export interface WorkflowContext {
  /** Workflow input data */
  input: Record<string, any>
  /** Current state of the workflow */
  state: Record<string, any>
  /** Current step being executed */
  currentStep: string
  /** Workflow execution history */
  history: Array<{
    step: string
    input: Record<string, any>
    output: any
    timestamp: number
  }>
  /** Timeout in milliseconds */
  timeout?: number
  /** Number of retry attempts */
  retries?: number
}

/**
 * Workflow execution options
 */
export interface WorkflowExecutionOptions {
  /** Maximum number of steps to execute */
  maxSteps?: number
  /** Timeout in milliseconds */
  timeout?: number
  /** Whether to execute the workflow asynchronously */
  async?: boolean
  /** Number of retry attempts */
  retries?: number
}

/**
 * Workflow execution result
 */
export interface WorkflowExecutionResult {
  /** Workflow execution status */
  status: 'completed' | 'failed' | 'timeout' | 'in_progress'
  /** Final output of the workflow */
  output?: any
  /** Error message if workflow failed */
  error?: string
  /** Workflow execution context */
  context: WorkflowContext
}

/**
 * Workflow registration response
 */
export interface WorkflowRegistrationResponse {
  /** Registration status */
  success: boolean
  /** Workflow ID */
  id?: string
  /** Error message if registration failed */
  error?: string
}
