/**
 * Workflows.do SDK
 * A framework for building, deploying, and managing enterprise-grade AI workflows
 */
export { WorkflowsClient } from './client'
export { default } from './client'

export interface AIConfig {
  [key: string]: (context: WorkflowContext) => Promise<any>
}

export interface WorkflowContext {
  /**
   * AI capabilities for intelligent processing
   */
  ai: AICapabilities
  
  /**
   * API integrations for external services
   */
  api: APIIntegrations
  
  /**
   * Database operations for data persistence
   */
  db: DatabaseOperations
  
  /**
   * Event data that triggered the workflow
   * This can vary based on the event type
   */
  event: {
    /**
     * Generic event properties
     */
    [key: string]: any
    
    /**
     * Common user event properties
     */
    name?: string
    email?: string
    company?: string
    
    /**
     * Customer feedback properties
     */
    customerId?: string
    feedback?: string
  }
}

export interface AICapabilities {
  /**
   * Generic AI function call with any parameters
   */
  [key: string]: (params: any) => Promise<any>
  
  /**
   * Research a company and return detailed information
   */
  researchCompany: (params: { company: string }) => Promise<any>
  
  /**
   * Research personal background based on contact information
   */
  researchPersonalBackground: (params: { 
    name: string, 
    email: string, 
    enrichedContact?: any 
  }) => Promise<any>
  
  /**
   * Research social activity based on contact information and profiles
   */
  researchSocialActivity: (params: { 
    name: string, 
    email: string, 
    enrichedContact?: any,
    socialProfiles?: any 
  }) => Promise<any>
  
  /**
   * Summarize GitHub activity based on profile information
   */
  summarizeGithubActivity: (params: { 
    name: string, 
    email: string, 
    enrichedContact?: any,
    githubProfile: any 
  }) => Promise<any>
  
  /**
   * Personalize an email sequence based on user information
   */
  personalizeEmailSequence: (params: { 
    name: string, 
    email: string, 
    company: string,
    personalProfile?: any,
    socialActivity?: any,
    companyProfile?: any,
    githubActivity?: any 
  }) => Promise<any>
  
  /**
   * Summarize content with a specified length
   */
  summarizeContent: (params: { 
    length: string,
    [key: string]: any 
  }) => Promise<string>
  
  /**
   * Define a function based on provided arguments
   */
  defineFunction: (params: any) => Promise<any>
}

export interface APIIntegrations {
  /**
   * Generic API integration
   */
  [key: string]: any
  
  /**
   * Apollo API for searching contact information
   */
  apollo: {
    search: (params: { 
      name?: string, 
      email?: string, 
      company?: string 
    }) => Promise<any>
  }
  
  /**
   * People Data Labs API for finding social profiles
   */
  peopleDataLabs: {
    findSocialProfiles: (params: { 
      name?: string, 
      email?: string, 
      company?: string 
    }) => Promise<any>
  }
  
  /**
   * GitHub API for accessing profile information
   */
  github: {
    profile: (params: { 
      name?: string, 
      email?: string, 
      company?: string,
      profile: string 
    }) => Promise<any>
  }
  
  /**
   * Email scheduling API
   */
  scheduleEmails: (params: { 
    emailSequence: any 
  }) => Promise<any>
  
  /**
   * Slack API for posting messages
   */
  slack: {
    postMessage: (params: { 
      channel: string, 
      content: any 
    }) => Promise<any>
  }
}

export interface DatabaseOperations {
  /**
   * Generic database collection operations
   */
  [key: string]: any
  
  /**
   * Users collection operations
   */
  users: {
    /**
     * Create a new user record
     */
    create: (params: { 
      name: string, 
      email: string, 
      company: string, 
      summary?: string,
      [key: string]: any 
    }) => Promise<{ url: string }>
    
    /**
     * Find a user by ID
     */
    findById: (id: string) => Promise<any>
    
    /**
     * Find users by query
     */
    find: (query: any) => Promise<any[]>
    
    /**
     * Update a user record
     */
    update: (id: string, data: any) => Promise<any>
    
    /**
     * Delete a user record
     */
    delete: (id: string) => Promise<any>
  }
}

export interface WorkflowConfig {
  name: string
  description?: string
  steps: Record<string, WorkflowStep>
  triggers?: string[]
  timeout?: number
}

export interface WorkflowStep {
  type?: 'action' | 'decision' | 'parallel' | 'wait' | 'terminal'
  action?: string
  next?: string | Record<string, string>
  onError?: string
  retry?: RetryConfig
  branches?: Record<string, string>
  joinCondition?: 'all' | 'any' | 'n' | ((results: any) => boolean)
  result?: any
}

export interface RetryConfig {
  maxAttempts: number
  backoff: 'fixed' | 'exponential' | 'linear'
  initialDelay: number
}

export interface IntegrationConfig {
  name: string
  actions: Record<string, (params: any) => Promise<any>>
  events?: string[]
}

/**
 * Create an AI-powered workflow
 * @param config The workflow configuration
 * @returns The configured workflow
 */
export function AI(config: AIConfig) {
  return config
}

/**
 * Define a new workflow
 * @param config The workflow configuration
 * @returns The configured workflow
 */
export function defineWorkflow(config: WorkflowConfig) {
  return config
}

/**
 * Create an integration with external services
 * @param config The integration configuration
 * @returns The configured integration
 */
export function defineIntegration(config: IntegrationConfig) {
  return config
}

/**
 * Define an event trigger for workflows
 * @param config The trigger configuration
 * @returns The configured trigger
 */
export function defineTrigger(config: any) {
  return config
}

/**
 * Create a reusable action for workflow steps
 * @param config The action configuration
 * @returns The configured action
 */
export function defineAction(config: any) {
  return config
}
