import { ApiClient } from './api'
import type { GeneratedTypeScriptCode } from '../types'
export type { ResearchOptions, ResearchResponse } from './research'

/**
 * Schema for defining interactive blocks in messaging platforms
 * @interface SlackBlockSchema
 */
export interface SlackBlockSchema {
  /** Title of the block */
  title: string
  /** Description text for the block */
  description: string
  /** Predefined options for selection */
  options?: string[]
  /** Whether free text input is allowed */
  freeText?: boolean
  /** Target messaging platform */
  platform?: 'slack' | 'teams' | 'discord'
  /** Timeout in seconds */
  timeout?: number
  /** Target channel for the message */
  channel?: string
  /** Users to mention in the message */
  mentions?: string[]
  blocks?: SlackBlock[] // Direct BlockKit components
  modal?: boolean // Support for modal dialogs
  components?: {
    datePicker?: boolean
    timePicker?: boolean
    multiSelect?: boolean
    overflow?: boolean
    image?: boolean
    context?: boolean
    divider?: boolean
    header?: boolean
    section?: boolean
  }
}

/**
 * Slack Block type for advanced UI components
 */
export interface SlackBlock {
  type: string
  block_id?: string
  [key: string]: any
}

/**
 * Definition for a function that can be executed
 * @interface FunctionDefinition
 */
export interface FunctionDefinition {
  /** Type of function execution */
  type?: 'Generation' | 'Code' | 'Human' | 'Agent'
  /** Output format of the function */
  format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video'
  /** JSON schema for validation */
  schema?: any
  /** Prompt template for generation functions */
  prompt?: string
  /** Code to execute for code functions */
  code?: string
  /** Role for the AI in generation functions */
  role?: string
  /** Agent to use for agent functions */
  agent?: string
  /** Interactive blocks for human functions */
  blocks?: SlackBlockSchema
  /** Additional properties */
  [key: string]: any
}

/**
 * Configuration options for AI execution
 * @interface AIConfig
 */
export interface AIConfig {
  /** Configuration properties */
  [key: string]: any
}

/**
 * Response from a function execution
 * @interface FunctionResponse
 * @template T - The type of data returned by the function
 */
export interface FunctionResponse<T = any> {
  /** The data returned by the function */
  data: T
  /** Metadata about the function execution */
  meta?: {
    /** Duration of execution in milliseconds */
    duration?: number
    /** Name of the model used for generation */
    modelName?: string
    /** Timestamp when the function was executed */
    timestamp?: number
    /** Additional metadata properties */
    [key: string]: any
  }
}

/**
 * Client for interacting with the Functions API
 * @class FunctionsClient
 */
export class FunctionsClient {
  /** API client instance */
  private api: ApiClient

  /**
   * Creates a new FunctionsClient instance
   * @param options - Configuration options
   * @param options.apiKey - Optional API key for authentication
   * @param options.baseUrl - Optional base URL for the API
   */
  constructor(options: { apiKey?: string; baseUrl?: string; concurrency?: number } = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://apis.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
      concurrency: options.concurrency || 50,
    })
  }

  /**
   * Set the concurrency limit for the request queue
   * @param limit - Maximum number of concurrent requests
   */
  setConcurrencyLimit(limit: number): void {
    this.api.queue.concurrency = limit
  }

  /**
   * Wait for all queued requests to complete
   * @returns Promise that resolves when all requests are complete
   */
  async waitForAll(): Promise<void> {
    return this.api.queue.onIdle()
  }

  /**
   * Run a function with the provided input and configuration
   * @param functionName - Name of the function to run
   * @param input - Input data for the function
   * @param config - Optional configuration for the function execution
   * @returns Promise resolving to the function response
   */
  async run<T = any>(functionName: string, input: any, config?: AIConfig): Promise<FunctionResponse<T>> {
    try {
      return await this.api.post<FunctionResponse<T>>(`/v1/functions/${functionName}`, {
        input,
        config,
      })
    } catch (error) {
      console.error(`Error running function ${functionName}:`, error)
      throw error
    }
  }

  /**
   * Create a new function
   * @param functionDefinition - Definition of the function to create
   * @returns Promise resolving to the created function
   */
  async create(functionDefinition: {
    /** Name of the function */
    name: string
    /** Description of the function */
    description?: string
    /** Type of function execution */
    type?: 'Generation' | 'Code' | 'Human' | 'Agent'
    /** Output format of the function */
    format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video'
    /** JSON schema for validation */
    schema?: any
    /** Prompt template for generation functions */
    prompt?: string
    /** Code to execute for code functions */
    code?: string
    /** Role for the AI in generation functions */
    role?: string
    /** User associated with the function */
    user?: string
    /** Agent to use for agent functions */
    agent?: string
  }): Promise<any> {
    try {
      return await this.api.post('/v1/functions', functionDefinition)
    } catch (error) {
      console.error('Error creating function:', error)
      throw error
    }
  }

  /**
   * List all functions
   * @param params - Optional pagination parameters
   * @returns Promise resolving to a list of functions
   */
  async list(params?: { limit?: number; page?: number }): Promise<any> {
    try {
      return await this.api.list('functions', params)
    } catch (error) {
      console.error('Error listing functions:', error)
      throw error
    }
  }

  /**
   * Get a function by ID
   * @param functionId - ID of the function to retrieve
   * @returns Promise resolving to the function
   */
  async get(functionId: string): Promise<any> {
    try {
      return await this.api.getById('functions', functionId)
    } catch (error) {
      console.error(`Error getting function ${functionId}:`, error)
      throw error
    }
  }

  /**
   * Update a function
   * @param functionId - ID of the function to update
   * @param data - Updated function data
   * @returns Promise resolving to the updated function
   */
  async update(functionId: string, data: any): Promise<any> {
    try {
      return await this.api.update('functions', functionId, data)
    } catch (error) {
      console.error(`Error updating function ${functionId}:`, error)
      throw error
    }
  }

  /**
   * Delete a function
   * @param functionId - ID of the function to delete
   * @returns Promise resolving to the deletion result
   */
  async delete(functionId: string): Promise<any> {
    try {
      return await this.api.remove('functions', functionId)
    } catch (error) {
      console.error(`Error deleting function ${functionId}:`, error)
      throw error
    }
  }

  /**
   * Execute a function as a Task, providing task-based execution and tracking
   * @param functionName - Name of the function to execute
   * @param input - Input data for the function
   * @param config - Optional configuration for the function execution
   * @returns Promise resolving to the task execution result
   */
  async executeAsTask<T = any>(functionName: string, input: any, config?: AIConfig): Promise<any> {
    try {
      // Create a task for the function execution
      return await this.api.post<any>(`/v1/functions/${functionName}/task`, {
        input,
        config,
      })
    } catch (error) {
      console.error(`Error executing function ${functionName} as task:`, error)
      throw error
    }
  }

  /**
   * Generates TypeScript code using the backend API
   * @param options - Code generation options
   * @returns Promise resolving to the generated code
   */
  async generateTypeScript(options: {
    prompt?: string;
    schema?: any;
    config?: AIConfig;
  }): Promise<GeneratedTypeScriptCode> {
    try {
      return await this.api.post<GeneratedTypeScriptCode>('/v1/typescript/generate', options);
    } catch (error) {
      console.error('Error generating TypeScript code:', error);
      throw error;
    }
  }
}

export default FunctionsClient
