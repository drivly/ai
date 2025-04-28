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

/**
 * Re-exports from workflows.do
 */

/**
 * Subscribe to events and execute a handler when they occur
 * @param eventName Name of the event to subscribe to
 * @param handler Function to execute when the event occurs
 */
export function on(eventName: string, handler: any): void {
  // Re-export from workflows.do
  return require('workflows.do').on(eventName, handler);
}

/**
 * Schedule a function to run on a cron schedule
 * @param cronExpression Cron expression defining the schedule
 * @param handler Function to execute on schedule
 * @param options Additional options for the scheduled task
 */
export function every(cronExpression: string, handler: any, options?: any): void {
  // Re-export from workflows.do
  return require('workflows.do').every(cronExpression, handler, options);
}

/**
 * Event handler function type
 */
export type AIEventHandler<TEvent = any, TResult = any> = (event: TEvent, context: any) => Promise<TResult>
