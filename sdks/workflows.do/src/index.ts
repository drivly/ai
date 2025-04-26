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
  APIAccess,
} from './types'
import { API } from './client.js'

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
        code: value.toString(),
      }
    } else if (typeof value === 'object') {
      workflowConfig[key] = {
        type: 'Schema',
        schema: value,
      }
    }
  }

  const api = new API()

  api
    .registerWorkflow(workflowConfig)
    .then((response: any) => {
      if (!response.success) {
        console.error('Error registering workflows:', response.error)
      }
    })
    .catch((error: Error) => {
      console.error('Error registering workflows:', error)
    })

  for (const key in config) {
    const value = config[key]

    if (typeof value === 'function') {
      instance[key] = async (event: any) => {
        const context: AIContext = {
          ai: instance,
          api: createAPIAccess(),
          db: createDatabaseAccess(),
          do: {},
        }

        try {
          return await value(event, context)
        } catch (error) {
          console.error(`Error executing workflow function ${key}:`, error)
          throw error
        }
      }
    } else if (typeof value === 'object') {
      instance[key] = async (input: any) => {
        try {
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
        } catch (error) {
          console.error(`Error executing AI function ${key}:`, error)
          throw error
        }
      }
    }
  }

  const proxy = new Proxy(instance, {
    get: (target: any, prop: string) => {
      if (prop in target) {
        return target[prop]
      }

      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return async (input: any) => {
          try {
            const response = await fetch(`${getBaseUrl()}/workflows/${prop}/execute`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                input,
              }),
            })

            return response.json()
          } catch (error) {
            console.error(`Error executing dynamic workflow ${prop}:`, error)
            throw error
          }
        }
      }

      return target[prop]
    },
  })

  return proxy as AIInstance
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
        },
      })
    },
  })
}

/**
 * Creates a database access object
 * @returns Database access object
 */
function createDatabaseAccess(): DatabaseAccess {
  if (typeof globalThis.DURABLE_OBJECT !== 'undefined' && globalThis.DURABLE_OBJECT) {
    const storage = globalThis.DURABLE_OBJECT.storage
    if (storage) {
      try {
        try {
          const g = globalThis as any
          if (typeof g.createNoSQLClient === 'function') {
            return g.createNoSQLClient(storage) as unknown as DatabaseAccess
          }
        } catch (importError) {}

        return storage as unknown as DatabaseAccess
      } catch (error) {
        console.error('Error initializing database access:', error)
      }
    }
  }

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
        },
      }
    },
  })
}

export { API } from './client.js'
export { CLI } from './cli.js'

/**
 * Subscribe to events and execute a handler when they occur
 * @param eventName Name of the event to subscribe to
 * @param handler Function to execute when the event occurs
 */
export function on(eventName: string, handler: AIEventHandler): void {
  fetch(`${getBaseUrl()}/triggers/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'event',
      event: eventName,
      handler: handler.toString(),
    }),
  }).catch((error) => console.error('Error creating trigger:', error))
}

/**
 * Schedule a function to run on a cron schedule
 * @param cronExpression Cron expression defining the schedule
 * @param handler Function to execute on schedule
 * @param options Additional options for the scheduled task
 */
export function every(cronExpression: string, handler: AIEventHandler, options?: any): void {
  fetch(`${getBaseUrl()}/cron/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cron: cronExpression,
      handler: handler.toString(),
      options,
    }),
  }).catch((error) => console.error('Error scheduling cron task:', error))
}

// export { actions } from 'actions.do'
// export { Analytics, initAnalytics, trackMetric, defineExperiment } from 'analytics.do'
// export { evals } from 'evals.do'
// export { ai as functionsAI } from 'functions.do'
// export { projects } from 'projects.do'
// export { tasks } from 'tasks.do'

/**
 * AI instance with typed methods
 */
export const ai = new Proxy({} as AIInstance, {
  get: (target, prop: string) => {
    if (typeof prop === 'string' && !prop.startsWith('_')) {
      return async (input: any) => {
        try {
          const response = await fetch(`${getBaseUrl()}/workflows/${prop}/execute`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input,
            }),
          })

          return response.json()
        } catch (error) {
          console.error(`Error executing dynamic workflow ${prop}:`, error)
          throw error
        }
      }
    }

    return target[prop as any]
  },
})

/**
 * Database access for storing and retrieving data
 */
export const db = createDatabaseAccess()

/**
 * External API integrations
 */
export { api as apiClient } from 'apis.do'

/**
 * Durable Objects access
 */
export const durableObjects = {}

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
  APIAccess,
}
