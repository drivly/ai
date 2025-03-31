/**
 * workflows.do - SDK for creating AI-powered workflows with strongly-typed functions
 */

import { API } from 'apis.do'
import type { 
  Workflow, 
  WorkflowStep, 
  WorkflowContext, 
  WorkflowExecutionOptions, 
  WorkflowExecutionResult,
  AIFunction,
  AIFunctionSchema,
  SchemaToOutput,
  AIConfig,
  AIContext,
  AIEventHandler,
  AIInstance,
  DatabaseAccess,
  APIAccess
} from './types.js'

/**
 * Creates an AI instance with typed methods based on the provided schemas
 * @param config Object containing event handlers and function schemas
 * @returns AI instance with typed methods
 */
export function AI<T extends AIConfig>(config: T): AIInstance {
  const instance: Record<string, AIFunction> = {}
  const api = new API()
  
  for (const key in config) {
    const value = config[key]
    
    if (typeof value === 'function') {
      instance[key] = async (event: any) => {
        const context: AIContext = {
          ai: instance,
          api: createAPIAccess(api),
          db: createDatabaseAccess(api)
        }
        
        return await value(event, context)
      }
    } 
    else if (typeof value === 'object') {
      instance[key] = async (input: any) => {
        return api.post('/ai/execute', {
          function: key,
          schema: value,
          input,
        })
      }
    }
  }
  
  return instance as AIInstance
}

/**
 * Creates a new workflow
 * @param workflow Workflow configuration
 * @returns Workflow instance
 */
export function createWorkflow(workflow: Workflow) {
  const api = new API()
  
  return {
    ...workflow,
    execute: async (input: Record<string, any>, options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult> => {
      return api.post('/workflows/execute', {
        workflow,
        input,
        options,
      })
    },
  }
}

/**
 * Creates an API access object
 * @param api The apis.do client instance
 * @returns API access object
 */
function createAPIAccess(api: API): APIAccess {
  return new Proxy({} as APIAccess, {
    get: (target, service: string) => {
      return new Proxy({} as Record<string, AIFunction>, {
        get: (serviceTarget, method: string) => {
          return async (...args: any[]) => {
            return api.post(`/${service}/${method}`, args[0] || {})
          }
        }
      })
    }
  })
}

/**
 * Creates a database access object
 * @param api The apis.do client instance
 * @returns Database access object
 */
function createDatabaseAccess(api: API): DatabaseAccess {
  return new Proxy({} as DatabaseAccess, {
    get: (target, collection: string) => {
      return {
        create: async (data: Record<string, any>) => {
          return api.post(`/db/${collection}/create`, data)
        },
        findOne: async (query: Record<string, any>) => {
          return api.post(`/db/${collection}/findOne`, query)
        },
        find: async (query: Record<string, any>) => {
          return api.post(`/db/${collection}/find`, query)
        },
        update: async (id: string, data: Record<string, any>) => {
          return api.post(`/db/${collection}/update`, { id, data })
        },
        delete: async (id: string) => {
          return api.post(`/db/${collection}/delete`, { id })
        }
      }
    }
  })
}

export type {
  Workflow,
  WorkflowStep,
  WorkflowContext,
  WorkflowExecutionOptions,
  WorkflowExecutionResult,
  AIFunction,
  AIFunctionSchema,
  SchemaToOutput,
  AIConfig,
  AIContext,
  AIEventHandler,
  AIInstance,
  DatabaseAccess,
  APIAccess
}
