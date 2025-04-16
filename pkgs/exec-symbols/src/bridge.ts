import { Event, FactSymbol, get_fact, get_verb_symbol, list, make_transition, nil, run_machine, StateMachine, TRUE, unit } from './exec-symbols'

/**
 * Creates a symbolic fact representing a function call
 */
const emitCallFact = (domain: string, method: string, args: Record<string, unknown> = {}) => {
  const argNouns = Object.entries(args ?? {}).map(([k, v]) => unit(`${k}:${String(v)}`))
  return FactSymbol(`${domain}.${method}`)(list(...argNouns))
}

/**
 * Wraps a service so that every method invocation is recorded as a symbolic event
 */
export const wrapTrackedService = <T extends Record<string, unknown>>(domain: string, service: T, record: (event: unknown) => void): T => {
  if (!service || typeof service !== 'object') {
    return {} as T
  }

  const proxy = {} as Record<string, unknown>

  for (const [method, fn] of Object.entries(service)) {
    if (typeof fn === 'function') {
      proxy[method] = async (args: unknown) => {
        const fact = emitCallFact(domain, method, args as Record<string, unknown>)
        const event = Event(fact)(Date.now())(nil)
        record(event)
        return await fn(args)
      }
    } else if (fn && typeof fn === 'object') {
      // Handle nested objects (like api.apollo.search)
      proxy[method] = wrapTrackedService(`${domain}.${method}`, fn as Record<string, unknown>, record)
    } else {
      proxy[method] = fn
    }
  }

  return proxy as T
}

/**
 * Base parameters shared across all handlers
 */
interface BaseHandlerParamsInternal {
  ai?: Record<string, unknown>
  api?: Record<string, unknown>
  db?: Record<string, unknown>
  event?: unknown
  [key: string]: unknown
}

// Export the type for external use
export type BaseHandlerParams = BaseHandlerParamsInternal

/**
 * Type for handlers used with execSymbolsAdapter
 */
type WorkflowHandlerInternal = (params: BaseHandlerParams) => Promise<unknown>

// Export the type for external use
export type WorkflowHandler = WorkflowHandlerInternal

/**
 * Adds symbolic event tracking to workflow definitions
 */
export const execSymbolsAdapter = (workflowDef: Record<string, WorkflowHandler>) => {
  const wrapped: Record<string, WorkflowHandler> = {}

  for (const [trigger, handler] of Object.entries(workflowDef)) {
    wrapped[trigger] = async ({ ai, api, db, event, ...rest }: BaseHandlerParams = {}) => {
      const log: unknown[] = []
      const record = (ev: unknown) => log.push(ev)

      // Track each service so calls become symbolic events
      const tAi = wrapTrackedService('ai', ai || {}, record)
      const tApi = wrapTrackedService('api', api || {}, record)
      const tDb = wrapTrackedService('db', db || {}, record)

      // Record the triggering event itself symbolically
      const triggerFact = FactSymbol(trigger)(list(unit('event')))
      const triggerEvent = Event(triggerFact)(Date.now())(nil)
      record(triggerEvent)

      // Simple state machine over the log (identity transition)
      const identityTransition = make_transition(() => () => TRUE)((state: unknown) => (_: unknown) => state)
      const machine = StateMachine(identityTransition)(null)
      const state = run_machine(machine)(list(...log))

      // Execute the original handler with tracked services
      const result = await handler({
        ai: tAi,
        api: tApi,
        db: tDb,
        event,
        symbolic: { state, log },
        ...rest,
      })

      return { result, symbolic: { state, log } }
    }
  }

  return wrapped
}

// INTERNAL IMPLEMENTATION FUNCTIONS

// Functions.do implementation - AI function prototyping and structured output
const createAIFunctionsImpl = <T extends Record<string, unknown>>(schema: T): T => {
  const proxy = {} as Record<string, unknown>

  for (const [method, returnType] of Object.entries(schema)) {
    proxy[method] = async (args: unknown, options?: { model?: string }) => {
      // In a real implementation, this would call an LLM with the method, args, and returnType schema
      // For now, we just return a mock object matching the returnType structure
      return structuredClone(returnType)
    }
  }

  return proxy as T
}

// Workflows.do implementation - Business process orchestration
const createWorkflowImpl = (workflowDef: Record<string, WorkflowHandler>) => {
  // Apply the exec symbols adapter to track all service calls
  const wrappedWorkflow = execSymbolsAdapter(workflowDef)

  // Create a more natural API interface that's directly accessible
  const workflow = {} as Record<string, unknown>

  for (const [trigger, handler] of Object.entries(wrappedWorkflow)) {
    workflow[trigger] = handler
  }

  // Add workflow-specific functionality
  return {
    ...workflow,
    // Add methods to get workflow metadata, handle triggers, etc.
    getDefinition: () => workflowDef,
    getTriggers: () => Object.keys(workflowDef),
  }
}

// Type for agent state
export interface AgentState {
  name: string
  role: string
  status: string
  history: unknown[]
  lastInput?: unknown
  timestamp?: number
  [key: string]: unknown
}

// Agents.do implementation - Autonomous digital workers
const createAgentImpl = (agentConfig: {
  name: string
  role: string
  job: string
  url?: string
  integrations?: string[]
  triggers?: string[]
  searches?: string[]
  actions?: string[]
  kpis?: string[]
}) => {
  // Create a state machine to track the agent's state
  const createAgentStateMachine = () => {
    // Define agent-specific transitions
    const agentTransition = make_transition(() => () => TRUE)((state: AgentState) => (input: unknown) => {
      // Process input and update state
      return { ...state, lastInput: input, timestamp: Date.now() }
    })

    return StateMachine(agentTransition)({
      name: agentConfig.name,
      role: agentConfig.role,
      status: 'idle',
      history: [],
    })
  }

  // Type for trigger handler
  type TriggerHandler = (params: Record<string, unknown>) => Promise<unknown>

  // Create workflows for each trigger
  const triggerWorkflows = (agentConfig.triggers || []).reduce(
    (acc, trigger) => {
      acc[trigger] = async ({ event, ...context }: Record<string, unknown> = {}) => {
        // Process the trigger, update agent state, and perform actions
        return { processed: true, trigger, event }
      }
      return acc
    },
    {} as Record<string, TriggerHandler>,
  )

  // For execSymbolsAdapter, we need to adapt our handlers to match WorkflowHandler
  const adaptedTriggerWorkflows = Object.entries(triggerWorkflows).reduce(
    (acc, [key, handler]) => {
      acc[key] = (params: BaseHandlerParams) => handler(params)
      return acc
    },
    {} as Record<string, WorkflowHandler>,
  )

  // Wrap the agent's workflows with exec symbols
  const wrappedWorkflows = execSymbolsAdapter(adaptedTriggerWorkflows)

  // Create a more natural API interface
  const agent = {} as Record<string, unknown>

  for (const [trigger, handler] of Object.entries(wrappedWorkflows)) {
    agent[trigger] = handler
  }

  // Type for action/search handlers
  type ActionHandler = (args: Record<string, unknown>) => Promise<unknown>

  // Create action methods
  const actions = (agentConfig.actions || []).reduce(
    (acc, action) => {
      acc[action] = async (args: Record<string, unknown> = {}) => {
        // Implement action logic
        return { action, args, status: 'completed' }
      }
      return acc
    },
    {} as Record<string, ActionHandler>,
  )

  // Create search methods
  const searches = (agentConfig.searches || []).reduce(
    (acc, search) => {
      acc[search] = async (query: Record<string, unknown> = {}) => {
        // Implement search logic
        return { search, query, results: [] }
      }
      return acc
    },
    {} as Record<string, ActionHandler>,
  )

  return {
    ...agentConfig,
    ...agent,
    stateMachine: createAgentStateMachine(),
    actions,
    searches,
  }
}

/**
 * Interface for API endpoint handler params
 */
export interface ApiHandlerParams {
  event: unknown
  [key: string]: unknown // Add index signature to make compatible with BaseHandlerParams
}

/**
 * Type for API endpoint handler
 */
export type ApiHandler = (params: ApiHandlerParams) => Promise<unknown>

export interface EndpointWithInvoke {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  handler: ApiHandler
  invoke: (args: Record<string, unknown>) => Promise<unknown>
}

// APIs.do implementation - Clickable developer experiences
const createAPIImpl = (apiConfig: {
  name: string
  description: string
  endpoints: Record<
    string,
    {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      path: string
      handler: ApiHandler
    }
  >
}) => {
  // Helper to adapt API handlers to work with execSymbolsAdapter
  const adaptApiHandler = (handler: ApiHandler): WorkflowHandler => {
    return (params: BaseHandlerParams) => handler({ event: params.event })
  }

  const wrappedEndpoints = Object.entries(apiConfig.endpoints).reduce(
    (acc, [name, endpoint]) => {
      // Adapt the API handler to match WorkflowHandler
      const adaptedHandler = adaptApiHandler(endpoint.handler)

      // Wrap with exec symbols
      const handlerAdapter = execSymbolsAdapter({ [name]: adaptedHandler })
      const wrappedHandler = handlerAdapter[name]

      acc[name] = {
        ...endpoint,
        handler: wrappedHandler,
        // Add a method to invoke the endpoint directly
        invoke: async (args: Record<string, unknown> = {}) => {
          return await wrappedHandler({ event: args })
        },
      }

      return acc
    },
    {} as Record<string, EndpointWithInvoke>,
  )

  return {
    ...apiConfig,
    endpoints: wrappedEndpoints,
    // Generate an API schema for documentation
    getSchema: () => ({
      name: apiConfig.name,
      description: apiConfig.description,
      endpoints: Object.entries(apiConfig.endpoints).reduce(
        (acc, [name, endpoint]) => {
          acc[name] = {
            method: endpoint.method,
            path: endpoint.path,
          }
          return acc
        },
        {} as Record<string, { method: string; path: string }>,
      ),
    }),
  }
}

// Type for database operations
export interface DbOperations {
  create: (data: Record<string, unknown>) => Promise<Record<string, unknown>>
  read: (id: string) => Promise<Record<string, unknown>>
  update: (id: string, data: Record<string, unknown>) => Promise<Record<string, unknown>>
  delete: (id: string) => Promise<Record<string, unknown>>
  search: (query: string) => Promise<{ query: string; results: unknown[] }>
}

// Database.do implementation - AI-enriched data
const createDatabaseImpl = <T extends Record<string, Record<string, string>>>(schema: T) => {
  // Create tables based on schema
  const database = {} as Record<string, DbOperations>

  for (const [tableName, tableSchema] of Object.entries(schema)) {
    // Create a collection for each table
    database[tableName] = {
      // Basic CRUD operations
      create: async (data: Record<string, unknown> = {}) => {
        // In a real implementation, this would store the data
        // For now, we just return a mock with an ID
        const id = `${tableName}_${Date.now()}`
        return { id, ...data, url: `https://database.do/${tableName}/${id}` }
      },

      read: async (id: string) => {
        // Mock read implementation
        return { id, _table: tableName }
      },

      update: async (id: string, data: Record<string, unknown> = {}) => {
        // Mock update implementation
        return { id, ...data, updated: true }
      },

      delete: async (id: string) => {
        // Mock delete implementation
        return { id, deleted: true }
      },

      // AI-powered search
      search: async (query: string) => {
        // In a real implementation, this would use vector search or similar
        return { query, results: [] }
      },
    }
  }

  return database as unknown as {
    [K in keyof T]: DbOperations
  }
}

/**
 * Interface for trigger configuration
 */
export interface TriggerConfig {
  name: string
  description: string
  source: string // e.g. 'database', 'api', 'time'
  condition: (event: Record<string, unknown>) => boolean
  action: (event: Record<string, unknown>) => Promise<unknown>
}

// Helper function to adapt a trigger action to WorkflowHandler
const adaptTriggerAction = (action: TriggerConfig['action']): WorkflowHandler => {
  return (params: BaseHandlerParams) => action(params.event as Record<string, unknown>)
}

// Triggers.do implementation - Start business processes
const createTriggerImpl = (config: TriggerConfig) => {
  // Create a wrapped action that records events
  const log: unknown[] = []
  const record = (ev: unknown) => log.push(ev)

  // Adapt the action for execSymbolsAdapter
  const adaptedAction = adaptTriggerAction(config.action)

  // Wrap the action with exec symbols
  const actionAdapter = execSymbolsAdapter({
    [config.name]: adaptedAction,
  })
  const wrappedAction = actionAdapter[config.name]

  return {
    ...config,
    // Method to trigger the action manually
    fire: async (event: Record<string, unknown> = {}) => {
      if (config.condition(event)) {
        // Record the trigger event
        const triggerFact = FactSymbol(`trigger.${config.name}`)(list(unit('event')))
        const triggerEvent = Event(triggerFact)(Date.now())(nil)
        record(triggerEvent)

        // Execute the action
        return await wrappedAction({ event })
      }
      return { triggered: false, reason: 'Condition not met' }
    },
    // Get the event log
    getLog: () => log,
  }
}

// Helper to adapt search handler to WorkflowHandler
const adaptSearchHandler = <T>(handler: (query: Record<string, unknown>) => Promise<T[]>): WorkflowHandler => {
  return (params: BaseHandlerParams) => {
    const eventObj = params.event as Record<string, unknown> | null | undefined
    return handler(eventObj && typeof eventObj === 'object' && 'query' in eventObj && eventObj.query ? (eventObj.query as Record<string, unknown>) : {})
  }
}

// Searches.do implementation - Provide context & understanding
const createSearchImpl = <T>(config: {
  name: string
  description: string
  sources: string[] // Data sources to search
  handler: (query: Record<string, unknown>) => Promise<T[]>
}) => {
  // Adapt and wrap the search handler
  const adaptedHandler = adaptSearchHandler(config.handler)
  const handlerAdapter = execSymbolsAdapter({
    [config.name]: adaptedHandler,
  })
  const wrappedHandler = handlerAdapter[config.name]

  return {
    ...config,
    // Method to execute the search
    execute: async (query: Record<string, unknown> = {}) => {
      const result = (await wrappedHandler({ event: { query } })) as { result: T[] }
      return result.result
    },
    // Method to get search metadata
    getMetadata: () => ({
      name: config.name,
      description: config.description,
      sources: config.sources,
    }),
  }
}

// Helper to adapt action handler to WorkflowHandler
const adaptActionHandler = <T extends Record<string, unknown>, R>(handler: (params: T) => Promise<R>): WorkflowHandler => {
  return (params: BaseHandlerParams) => {
    const eventObj = params.event as Record<string, unknown> | null | undefined
    return handler(eventObj && typeof eventObj === 'object' && 'params' in eventObj && eventObj.params ? (eventObj.params as T) : ({} as T))
  }
}

// Actions.do implementation - Impact the external world
const createActionImpl = <T extends Record<string, unknown>, R>(config: {
  name: string
  description: string
  handler: (params: T) => Promise<R>
  permissions?: string[]
  validation?: (params: T) => boolean
}) => {
  // Adapt and wrap the action handler
  const adaptedHandler = adaptActionHandler(config.handler)
  const handlerAdapter = execSymbolsAdapter({
    [config.name]: adaptedHandler,
  })
  const wrappedHandler = handlerAdapter[config.name]

  return {
    ...config,
    // Method to execute the action
    execute: async (params: T) => {
      // Validate parameters if a validation function is provided
      if (config.validation && !config.validation(params)) {
        return { success: false, error: 'Validation failed' } as unknown as R
      }

      // Execute the handler
      const result = (await wrappedHandler({ event: { params } })) as { result: R }
      return result.result
    },
    // Method to get action metadata
    getMetadata: () => ({
      name: config.name,
      description: config.description,
      permissions: config.permissions || [],
    }),
  }
}

// Events.do implementation - Track business events
const createEventTrackerImpl = () => {
  const eventLog: unknown[] = []

  return {
    track: async (eventName: string, data: Record<string, unknown> = {}) => {
      // Create a fact for the event
      const eventFact = FactSymbol(eventName)(list(...Object.entries(data).map(([k, v]) => unit(`${k}:${String(v)}`))))
      const event = Event(eventFact)(Date.now())(nil)

      // Add to log
      eventLog.push(event)

      return { eventName, timestamp: Date.now(), data }
    },
    getLog: () => eventLog,
    getEvents: (eventName?: string) => {
      if (eventName) {
        return eventLog.filter((e) => {
          // We know it's an EventType since we're filtering eventLog
          const typedEvent = e as Parameters<typeof get_fact>[0]
          const fact = get_fact(typedEvent)
          return get_verb_symbol(fact) === eventName
        })
      }
      return eventLog
    },
  }
}

// The singleton event tracker for the global track function
const _eventTracker = createEventTrackerImpl()

// PUBLIC API EXPORTS - MATCHING AI.MD DOCUMENTATION

// Workflows.do - Export as AI function
export const AI = (workflowDef: Record<string, WorkflowHandler>) => {
  return createWorkflowImpl(workflowDef)
}

// Functions.do - Export as module with named export to avoid name conflict
export const FunctionsAI = <T extends Record<string, unknown>>(schema: T): T => {
  return createAIFunctionsImpl(schema)
}

// Agents.do
export const Agent = (config: {
  name: string
  role: string
  job: string
  url?: string
  integrations?: string[]
  triggers?: string[]
  searches?: string[]
  actions?: string[]
  kpis?: string[]
}) => {
  return createAgentImpl(config)
}

// Database.do
export const DB = <T extends Record<string, Record<string, string>>>(schema: T) => {
  return createDatabaseImpl(schema)
}

// Events.do
export const track = (eventName: string, eventData: Record<string, unknown> = {}) => {
  return _eventTracker.track(eventName, eventData)
}

// APIs.do
export const API = (apiConfig: {
  name: string
  description: string
  endpoints: Record<
    string,
    {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      path: string
      handler: ApiHandler
    }
  >
}) => {
  return createAPIImpl(apiConfig)
}

// Remove the conflicting re-export at the end of the file
export {
  createActionImpl as createAction,
  createAgentImpl as createAgent,
  createAIFunctionsImpl as createAIFunctions,
  createAPIImpl as createAPI,
  createDatabaseImpl as createDatabase,
  createEventTrackerImpl as createEventTracker,
  createSearchImpl as createSearch,
  createTriggerImpl as createTrigger,
  createWorkflowImpl as createWorkflow,
}
