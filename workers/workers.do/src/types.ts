/**
 * Base interface for worker exports
 */
export interface WorkerExport {
  type: 'function' | 'constant'
}

/**
 * Constant export definition
 */
export interface ConstantExport extends WorkerExport {
  type: 'constant'
  value: any
}

/**
 * Function export definition
 */
export interface FunctionExport extends WorkerExport {
  type: 'function'
  examples: ExampleTest[]
  documentation: string
}

/**
 * Example test for a function
 */
export interface ExampleTest {
  id: number
  description: string
  input: string
  expectedOutput: string
}

/**
 * Documentation for a function
 */
export interface FunctionDoc {
  description: string
  params?: Record<string, string>
  returns?: string
}
