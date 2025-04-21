/**
 * Type definitions for agents.do SDK
 */

/**
 * Generic AI function type
 */
export type AIFunction<TInput = any, TOutput = any> = {
  (input: TInput, config?: any): Promise<TOutput>
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Agent name/identifier */
  name: string
  /** Agent description */
  description?: string
  /** Functions available to the agent */
  functions?: string[] | AIFunction[]
  /** Workflows available to the agent */
  workflows?: string[]
  /** Tools available to the agent */
  tools?: string[]
  /** System prompt for the agent */
  systemPrompt?: string
  /** Base model for the agent */
  baseModel?: string
  /** Memory configuration */
  memory?: AgentMemoryConfig
  /** Additional configuration properties */
  [key: string]: any
}

/**
 * Agent memory configuration
 */
export interface AgentMemoryConfig {
  /** Whether memory is enabled */
  enabled?: boolean
  /** Memory type */
  type?: 'conversation' | 'vector' | 'hybrid'
  /** Maximum memory items to retain */
  maxItems?: number
  /** Additional memory configuration */
  [key: string]: any
}

/**
 * Agent response
 */
export interface AgentResponse<T = any> {
  /** Response data */
  data: T
  /** Response metadata */
  meta?: {
    /** Processing duration in milliseconds */
    duration?: number
    /** Token usage information */
    tokens?: {
      prompt?: number
      completion?: number
      total?: number
    }
    /** Additional metadata */
    [key: string]: any
  }
}

/**
 * Agent execution context
 */
export interface AgentContext {
  /** Input data */
  input: Record<string, any>
  /** Current state */
  state: Record<string, any>
  /** Conversation history */
  history: AgentMessage[]
  /** Available functions */
  functions: Record<string, AIFunction>
  /** Available workflows */
  workflows: Record<string, any>
  /** Available tools */
  tools: Record<string, any>
}

/**
 * Agent message
 */
export interface AgentMessage {
  /** Message role */
  role: 'user' | 'agent' | 'system' | 'function'
  /** Message content */
  content: string
  /** Timestamp */
  timestamp: number
  /** Function call details if role is 'function' */
  functionCall?: {
    /** Function name */
    name: string
    /** Function arguments */
    arguments: Record<string, any>
  }
  /** Additional message properties */
  [key: string]: any
}

/**
 * Agent execution options
 */
export interface AgentExecutionOptions {
  /** Maximum number of steps to execute */
  maxSteps?: number
  /** Timeout in milliseconds */
  timeout?: number
  /** Whether to execute asynchronously */
  async?: boolean
  /** Whether to stream responses */
  stream?: boolean
}

/**
 * Agent execution result
 */
export interface AgentExecutionResult {
  /** Execution status */
  status: 'completed' | 'failed' | 'timeout' | 'in_progress'
  /** Final output */
  output?: any
  /** Error message if execution failed */
  error?: string
  /** Execution context */
  context: AgentContext
}

/**
 * Agent client options
 */
export interface AgentClientOptions {
  /** API key */
  apiKey?: string
  /** Base URL */
  baseUrl?: string
  /** Default agent configuration */
  defaultConfig?: Partial<AgentConfig>
}

/**
 * Agent do function response
 */
export interface AgentDoResponse<T = any> extends AgentResponse<T> {}

/**
 * Template literal tag function for agent do
 */
export interface AgentDoTemplateFunction {
  (strings: TemplateStringsArray, ...values: any[]): Promise<any>
}

/**
 * Agent do function with various call patterns
 */
export interface AgentDoFunction {
  (input: string | Record<string, any>, options?: AgentExecutionOptions): Promise<any>

  (strings: TemplateStringsArray, ...values: any[]): Promise<any>

  (agentId: string): {
    (input: string | Record<string, any>, options?: AgentExecutionOptions): Promise<any>
    (strings: TemplateStringsArray, ...values: any[]): Promise<any>
  }
}
