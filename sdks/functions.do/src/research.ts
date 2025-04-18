/**
 * Types for research functions
 */

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
  success: boolean
  taskId: string
  jobId: string
}
