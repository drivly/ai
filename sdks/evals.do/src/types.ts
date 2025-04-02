/**
 * Type definitions for evals.do SDK
 */

import { ClientOptions as ApiClientOptions } from 'apis.do'

/**
 * Configuration options for the Evals client
 */
export interface EvalsOptions extends ApiClientOptions {
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
