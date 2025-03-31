/**
 * workflows.do - SDK for creating AI-powered workflows with strongly-typed functions
 */

/**
 * Determines the base URL based on the environment
 * @returns The base URL for API requests
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000'
    }
    if (window.location.hostname.includes('.sg')) {
      return 'https://apis.do.sg'
    }
  }
  return 'https://apis.do'
}

import type { 
  Workflow, 
  WorkflowStep, 
  WorkflowContext, 
  WorkflowExecutionOptions, 
  WorkflowExecutionResult,
  WorkflowRegistrationResponse,
  AIFunction,
  AIFunctionSchema,
  SchemaToOutput,
  AIConfig,
  AIContext,
  AIEventHandler,
  AIInstance,
  DatabaseAccess,
  APIAccess
} from './types'

/**
 * Creates an AI instance with typed methods based on the provided schemas
 * @param config Object containing event handlers and function schemas
 * @returns AI instance with typed methods
 */
export function AI<T extends AIConfig>(config: T): AIInstance {
  const instance: Record<string, AIFunction> = {}
  
  const workflowConfig: Record<string, any> = {}
  
  for (const key in config) {
    const value = config[key]
    
    if (typeof value === 'function') {
      workflowConfig[key] = {
        type: 'Function',
        code: value.toString()
      }
    } 
    else if (typeof value === 'object') {
      workflowConfig[key] = {
        type: 'Schema',
        schema: value
      }
    }
  }
  
  fetch(`${getBaseUrl()}/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowConfig),
  })
  .then(response => response.json())
  .then(data => {
    if (!data.success) {
      console.error('Error registering workflows:', data.error)
    }
  })
  .catch(error => {
    console.error('Error registering workflows:', error)
  })
  
  for (const key in config) {
    const value = config[key]
    
    if (typeof value === 'function') {
      instance[key] = async (event: any) => {
        const context: AIContext = {
          ai: instance,
          api: createAPIAccess(),
          db: createDatabaseAccess()
        }
        
        return await value(event, context)
      }
    } 
    else if (typeof value === 'object') {
      instance[key] = async (input: any) => {
        const response = await fetch(`${getBaseUrl()}/ai/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            function: key,
            schema: value,
            input,
          }),
        })
        
        return response.json()
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
  return {
    ...workflow,
    execute: async (input: Record<string, any>, options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult> => {
      const response = await fetch(`${getBaseUrl()}/workflows/execute`, {
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
    },
  }
}

/**
 * Creates an API access object
 * @returns API access object
 */
function createAPIAccess(): APIAccess {
  return new Proxy({} as APIAccess, {
    get: (target, service: string) => {
      return new Proxy({} as Record<string, AIFunction>, {
        get: (serviceTarget, method: string) => {
          return async (...args: any[]) => {
            const response = await fetch(`${getBaseUrl()}/${service}/${method}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(args[0] || {}),
            })
            
            return response.json()
          }
        }
      })
    }
  })
}

/**
 * Creates a database access object
 * @returns Database access object
 */
function createDatabaseAccess(): DatabaseAccess {
  return new Proxy({} as DatabaseAccess, {
    get: (target, collection: string) => {
      return {
        create: async (data: Record<string, any>) => {
          const response = await fetch(`${getBaseUrl()}/db/${collection}/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          
          return response.json()
        },
        findOne: async (query: Record<string, any>) => {
          const response = await fetch(`${getBaseUrl()}/db/${collection}/findOne`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
          })
          
          return response.json()
        },
        find: async (query: Record<string, any>) => {
          const response = await fetch(`${getBaseUrl()}/db/${collection}/find`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
          })
          
          return response.json()
        },
        update: async (id: string, data: Record<string, any>) => {
          const response = await fetch(`${getBaseUrl()}/db/${collection}/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, data }),
          })
          
          return response.json()
        },
        delete: async (id: string) => {
          const response = await fetch(`${getBaseUrl()}/db/${collection}/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          })
          
          return response.json()
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
  WorkflowRegistrationResponse,
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
