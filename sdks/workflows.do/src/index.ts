/**
 * workflows.do - SDK for creating AI-powered workflows with strongly-typed functions
 */

import type { 
  Workflow, 
  WorkflowStep, 
  WorkflowContext, 
  WorkflowExecutionOptions, 
  WorkflowExecutionResult 
} from './types.js'

/**
 * Creates a new workflow
 * @param workflow Workflow configuration
 * @returns Workflow instance
 */
export function createWorkflow(workflow: Workflow) {
  return {
    ...workflow,
    execute: async (input: Record<string, any>, options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult> => {
      const response = await fetch('https://apis.do/workflows/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow,
          input,
          options,
        }),
      })
      
      return response.json()
    }
  }
}

export type {
  Workflow,
  WorkflowStep,
  WorkflowContext,
  WorkflowExecutionOptions,
  WorkflowExecutionResult
}
