/**
 * Type definitions for apis.do SDK
 * 
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 */

/**
 * Reusable AI capabilities with typed inputs and outputs
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "functions".
 */
export interface Function {
  id: string;
  name: string;
  type?: ('Generation' | 'Code' | 'Human' | 'Agent') | null;
/**
   * Make this function available to other users
   */
  public?: boolean | null;
/**
   * Original function this was cloned from
   */
  clonedFrom?: string;
/**
   * Monetization settings for this function
   */
  pricing?: {
    /**
     * Enable monetization for this function
     */
    isMonetized?: boolean | null;
    /**
     * Billing model for this function
     */
    billingModel?: ('payPerUse' | 'prepaid' | 'postpaid' | 'subscription') | null;
    /**
     * Price per use in USD cents (platform fee is 30% above LLM costs)
     */
    pricePerUse?: number | null;
    /**
     * Unit of measurement for consumption
     */
    consumptionUnit?: ('tokens' | 'requests' | 'compute_ms') | null;
    /**
     * Price per consumption unit in USD cents
     */
    consumptionRate?: number | null;
    /**
     * Subscription plan for this function
     */
    billingPlan?: string;
    /**
     * Stripe Product ID (auto-generated)
     */
    stripeProductId?: string | null;
    /**
     * Stripe Price ID (auto-generated)
     */
    stripePriceId?: string | null;
  };
  format?: ('Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video') | null;
  schemaYaml?: string | null;
  shape?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  code?: string | null;
  prompt?: string;
  role?: string | null;
  user?: string;
  agent?: string;
/**
   * Example arguments for this function
   */
  examples?: (string)[] | null;
/**
   * Goals this function contributes to
   */
  goals?: (string)[] | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Orchestrates functions into reusable business processes
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "workflows".
 */
export interface Workflow {
  id: string;
  name?: string | null;
  type?: string | null;
  code?: string | null;
  functions?: string;
  module?: string;
  package?: string;
  deployment?: string;
/**
   * Goals this workflow contributes to
   */
  goals?: (string)[] | null;
/**
   * Make this workflow available to other users
   */
  public?: boolean | null;
/**
   * Original workflow this was cloned from
   */
  clonedFrom?: string;
/**
   * Monetization settings for this workflow
   */
  pricing?: {
    /**
     * Enable monetization for this workflow
     */
    isMonetized?: boolean | null;
    /**
     * Billing model for this workflow
     */
    billingModel?: ('payPerUse' | 'prepaid' | 'postpaid' | 'subscription') | null;
    /**
     * Price per use in USD cents (platform fee is 30% above LLM costs)
     */
    pricePerUse?: number | null;
    /**
     * Unit of measurement for consumption
     */
    consumptionUnit?: ('tokens' | 'requests' | 'compute_ms') | null;
    /**
     * Price per consumption unit in USD cents
     */
    consumptionRate?: number | null;
    /**
     * Subscription plan for this workflow
     */
    billingPlan?: string;
    /**
     * Stripe Product ID (auto-generated)
     */
    stripeProductId?: string | null;
    /**
     * Stripe Price ID (auto-generated)
     */
    stripePriceId?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * Autonomous AI agents that can perform tasks using functions and workflows
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "agents".
 */
export interface Agent {
  id: string;
  name?: string | null;
/**
   * Make this agent available to other users
   */
  public?: boolean | null;
/**
   * Original agent this was cloned from
   */
  clonedFrom?: string;
/**
   * Monetization settings for this agent
   */
  pricing?: {
    /**
     * Enable monetization for this agent
     */
    isMonetized?: boolean | null;
    /**
     * Billing model for this agent
     */
    billingModel?: ('payPerUse' | 'prepaid' | 'postpaid' | 'subscription') | null;
    /**
     * Price per use in USD cents (platform fee is 30% above LLM costs)
     */
    pricePerUse?: number | null;
    /**
     * Unit of measurement for consumption
     */
    consumptionUnit?: ('tokens' | 'requests' | 'compute_ms') | null;
    /**
     * Price per consumption unit in USD cents
     */
    consumptionRate?: number | null;
    /**
     * Subscription plan for this agent
     */
    billingPlan?: string;
    /**
     * Stripe Product ID (auto-generated)
     */
    stripeProductId?: string | null;
    /**
     * Stripe Price ID (auto-generated)
     */
    stripePriceId?: string | null;
  };
/**
   * Goals this agent contributes to
   */
  goals?: (string)[] | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines semantic types with their various grammatical forms
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "things".
 */
export interface Thing {
  id: string;
  name?: string | null;
/**
   * Singular form
   */
  singular?: string | null;
/**
   * Plural form
   */
  plural?: string | null;
/**
   * Possessive form
   */
  possessive?: string | null;
/**
   * Plural possessive form
   */
  pluralPossessive?: string | null;
/**
   * Related verb
   */
  verb?: string | null;
/**
   * Third person singular present tense
   */
  act?: string | null;
/**
   * Gerund
   */
  activity?: string | null;
/**
   * Past tense
   */
  event?: string | null;
  resources?: {
    docs?: (string)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines semantic noun entities with their various grammatical forms
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "nouns".
 */
export interface Noun {
  id: string;
  name?: string | null;
/**
   * Singular form like User
   */
  singular?: string | null;
/**
   * Plural form like Users
   */
  plural?: string | null;
/**
   * Possessive form like User's
   */
  possessive?: string | null;
/**
   * Plural possessive form like Users'
   */
  pluralPossessive?: string | null;
/**
   * Related verb like Use
   */
  verb?: string | null;
/**
   * Third person singular present tense like Uses
   */
  act?: string | null;
/**
   * Gerund like Using
   */
  activity?: string | null;
/**
   * Past tense like Used
   */
  event?: string | null;
/**
   * Display order in admin interface
   */
  order?: number | null;
/**
   * Admin group for organizing collections
   */
  group?: string | null;
  type?:
    | {
        relationTo: 'things';
        value: string;
      }[]
    | null;
  resources?: {
    docs?: (string)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines action verbs and their conjugations for semantic relationships
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "verbs".
 */
export interface Verb {
  id: string;
/**
   * Active tense like Create
   */
  action?: string | null;
/**
   * Third person singular present tense like Creates
   */
  act?: string | null;
/**
   * Gerund like Creating
   */
  activity?: string | null;
/**
   * Past tense like Created
   */
  event?: string | null;
/**
   * Subject like Creator
   */
  subject?: string | null;
/**
   * Object like Creation
   */
  object?: string | null;
/**
   * Opposite like Destroy
   */
  inverse?: string | null;
/**
   * Third person singular present tense like Destroys
   */
  inverseAct?: string | null;
/**
   * Gerund like Destroying
   */
  inverseActivity?: string | null;
/**
   * Past tense like Destroyed
   */
  inverseEvent?: string | null;
/**
   * Subject like Destroyer
   */
  inverseSubject?: string | null;
/**
   * Object like Destruction
   */
  inverseObject?: string | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines event triggers that can initiate workflows and actions
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "triggers".
 */
export interface Trigger {
  id: string;
  name?: string | null;
  payload?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  config?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Records and manages search queries and their results
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "searches".
 */
export interface Search {
  id: string;
  name?: string | null;
  query?: string | null;
  searchType?: ('text' | 'vector' | 'hybrid') | null;
  results?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  embedding?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines semantic relationships between resources using subject-verb-object patterns
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "actions".
 */
export interface Action {
  id: string;
  subject?: string;
  verb?: string;
  object?: string;
  hash?: string | null;
  generation?: {
    docs?: (string)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * Records of AI model generation requests and responses
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "generations".
 */
export interface Generation {
  id: string;
  action?: string;
  settings?: string;
  request?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  response?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  error?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  status?: ('success' | 'error') | null;
  duration?: number | null;
  processingMode?: ('realtime' | 'batch') | null;
  batch?: string;
  updatedAt: string;
  createdAt: string;
}

/**
 * Records of all significant occurrences within the platform
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "events".
 */
export interface Event {
  id: string;
  type?: string | null;
  source?: string | null;
  subject?: string;
  data?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  metadata?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  action?: string;
  trigger?: string;
  search?: string;
  function?: string;
  workflow?: string;
  agent?: string;
  generations?: (string)[] | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Tracks execution paths and performance metrics for debugging
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "traces".
 */
export interface Trace {
  id: string;
  name?: string | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Manages external service integrations and their configurations
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "integrations".
 */
export interface Integration {
  id: string;
  name?: string | null;
  provider?: ('composio' | 'linear') | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines events from external systems that can trigger workflows
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "integrationTriggers".
 */
export interface IntegrationTrigger {
  id: string;
  displayName?: string | null;
  description?: string | null;
  appKey?: string | null;
  appName?: string | null;
  appId?: string | null;
  logo?: string | null;
  payload?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  config?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Defines actions that can be performed through external integrations
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "integrationActions".
 */
export interface IntegrationAction {
  id: string;
  displayName?: string | null;
  description?: string | null;
  appKey?: string | null;
  appName?: string | null;
  appId?: string | null;
  version?: string | null;
  parameters?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  response?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * Workflow step configuration
 */
export interface WorkflowStep {
  name: string
  description?: string
  function?: string
  input?: Record<string, any>
  next?: string | Record<string, string>
  isFinal?: boolean
}

export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}

/**
 * ListResponse - Paginated list response
 *
 * Represents paginated list responses
 */
export interface ListResponse<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasNextPage?: boolean
  }
}

/**
 * QueryParams - Parameters for querying collections
 *
 * Represents parameters for querying collections
 */
export interface QueryParams {
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
  select?: string | string[]
  populate?: string | string[]
}

/**
 * ClientOptions - Options for API client initialization
 *
 * Represents options for API client initialization
 */
export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}

/**
 * CollectionEndpoints - Type for collection-specific endpoints
 *
 * Represents collection-specific endpoints
 */
export interface CollectionEndpoints<T> {
  find: (params?: Record<string, any>, queryParams?: QueryParams) => Promise<ListResponse<T>>
  get: (id: string) => Promise<T>
  create: (data: Partial<T>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<T>
  search: (query: string, params?: QueryParams) => Promise<ListResponse<T>>
}
