/**
 * Evals.do SDK
 * Evaluation tools for AI components, functions, workflows, and agents
 */
import { API } from 'apis.do'

export interface EvalOptions {
  metrics?: string[]
  apiKey?: string
}

export interface EvalResult {
  score: number
  metrics: Record<string, number>
  feedback: string
}

/**
 * Evaluate an AI function or component
 * @param functionId The ID of the function to evaluate
 * @param testCases Array of test cases to run
 * @param options Configuration options
 * @returns Evaluation results
 */
export async function evaluateFunction(
  functionId: string, 
  testCases: Array<{input: any, expectedOutput?: any}>, 
  options: EvalOptions = {}
): Promise<EvalResult> {
  const api = new API({
    apiKey: options.apiKey
  })
  
  return api.post('/evals/function', {
    functionId,
    testCases,
    metrics: options.metrics
  })
}

export default {
  evaluateFunction
}
