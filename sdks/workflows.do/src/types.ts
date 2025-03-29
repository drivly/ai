/**
 * Type definitions for workflows.do SDK
 */

export type AIFunction<TInput = any, TOutput = any> = {
  (input: TInput, config?: any): Promise<TOutput>
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
