import type { ClientOptions } from 'apis.do/types'

/**
 * Options for the Research client
 */
export interface ResearchClientOptions extends ClientOptions {}

/**
 * Parameters for research requests
 */
export interface ResearchOptions {
  /**
   * The topic to research (required)
   */
  topic: string

  /**
   * The depth of research to perform
   * @default 'medium'
   */
  depth?: 'shallow' | 'medium' | 'deep'

  /**
   * Sources to include in the research
   */
  sources?: string[]

  /**
   * Format for the research results
   * @default 'markdown'
   */
  format?: 'markdown' | 'json' | 'html'

  /**
   * Callback URL to notify when research is complete
   */
  callback?: string
}

/**
 * Response from a research request
 */
export interface ResearchResponse {
  /**
   * Indicates if the request was successful
   */
  success: boolean

  /**
   * ID of the created task
   */
  taskId: string

  /**
   * ID of the queued job
   */
  jobId: string
}

/**
 * Error response from a research request
 */
export interface ResearchError {
  /**
   * Error message
   */
  error: string
}
