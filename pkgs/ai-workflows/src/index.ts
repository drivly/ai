/**
 * Re-exports from workflows.do
 */
// import { on, every, AIEventHandler } from 'workflows.do'

/**
 * Generic function type for AI functions
 */
export type GenericAIFunction = (input: any, config?: any) => Promise<any>

/**
 * Basic workflow orchestration interface
 */
export interface Workflow {
  name: string
  description?: string
  functions: GenericAIFunction[]
}

/**
 * Create a new workflow
 */
export function createWorkflow(workflow: Workflow): Workflow {
  return workflow
}

// Re-export functions and types from workflows.do
// export { on, every }
// export type { AIEventHandler }
