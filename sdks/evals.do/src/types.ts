/**
 * Type definitions for evals.do SDK
 */

import type { ClientOptions as ApiClientOptions } from 'apis.do/types'

/**
 * Configuration options for the Evals client
 */
export interface EvalsOptions extends ApiClientOptions {
  /**
   * Base URL for API requests
   * @default 'https://evals.do'
   */
  baseUrl?: string

  /**
   * API key for authentication
   */
  apiKey?: string
  /**
   * Whether to store results locally
   * @default true
   */
  storeLocally?: boolean

  /**
   * Whether to send results to the cloud backend
   * @default true
   */
  storeRemotely?: boolean

  /**
   * Path to the local SQLite database
   * @default './.evalite.db'
   */
  dbPath?: string
}

/**
 * Evaluation test data
 */
export interface Test {
  id: string
  name: string
  description?: string
  input: Record<string, any>
  expected?: Record<string, any>
  tags?: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Evaluation result
 */
export interface Result {
  id: string
  testId: string
  output: Record<string, any>
  score?: number
  metrics?: Record<string, number>
  duration?: number
  error?: string
  createdAt: string
  updatedAt: string
}

/**
 * Collection of evaluation results
 */
export interface TestRun {
  id: string
  name: string
  description?: string
  testIds: string[]
  results: Result[]
  startedAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Evaluation task executor
 */
export interface TaskExecutor<T = any, R = any> {
  execute: (input: T) => Promise<R>
}

/**
 * Evaluation metric calculator
 */
export interface MetricCalculator<T = any, R = any> {
  calculate: (result: R, expected: T) => number | Record<string, number>
}

/**
 * Evaluation options
 */
export interface EvaluationOptions {
  metrics?: Record<string, MetricCalculator>
  concurrency?: number
  timeout?: number
}

/**
 * Prompt variation configuration for function evaluation
 */
export interface PromptVariation {
  /** Name of the prompt variation */
  name: string
  /** System prompt for the model */
  system?: string
  /** User prompt template */
  prompt?: string
  /** Temperature for model sampling */
  temperature?: number
  /** Additional configuration options */
  [key: string]: any
}

/**
 * Configuration for function evaluation with multiple models and prompts
 */
export interface FunctionEvalConfig {
  /** Name of the function to evaluate */
  name: string
  /** Schema definition for the function */
  schema: Record<string, any>
  /** List of model identifiers to test */
  models: string[]
  /** List of prompt variations to test */
  prompts: PromptVariation[]
  /** Optional evaluation options */
  options?: EvaluationOptions
}
