import { API } from 'apis.do'
import { ExperimentEvaluationResult, EvaluationParams, EvaluationResult, ExperimentSummary } from './types.js'

/**
 * Generates all possible combinations of the provided parameters.
 * @param params An object where each key maps to an array of possible values
 * @returns An array of objects representing all possible combinations
 */
export function cartesian<T extends Record<string, any[]>>(params: T): Array<{ [K in keyof T]: T[K][number] }> {
  const keys = Object.keys(params) as Array<keyof T>

  if (keys.length === 0) return []

  const firstKey = keys[0]
  let result = params[firstKey].map((value) => ({ [firstKey]: value }) as { [K in keyof T]: T[K][number] })

  for (let i = 1; i < keys.length; i++) {
    const currentKey = keys[i]
    const currentValues = params[currentKey]

    const newResult: Array<{ [K in keyof T]: T[K][number] }> = []

    for (const existingObj of result) {
      for (const value of currentValues) {
        newResult.push({
          ...existingObj,
          [currentKey]: value,
        } as { [K in keyof T]: T[K][number] })
      }
    }

    result = newResult
  }

  return result
}

/**
 * Runs an experiment with multiple parameter variations.
 * @param name The name of the experiment
 * @param config The experiment configuration
 * @returns The experiment results
 */
export async function experiment<T, E>(
  name: string,
  config: {
    models: string[]
    temperature: number | number[]
    seeds: number
    prompt: (params: { input: any }) => string[]
    inputs: () => Promise<T[]>
    expected: E
    schema: any
    scorers: any[]
    batch?: {
      enabled: boolean | number
      provider?: string
      providerConfig?: Record<string, any>
    }
  },
) {
  const temperatures = Array.isArray(config.temperature) ? config.temperature : [config.temperature]

  const seeds = Array.from({ length: config.seeds }, (_, i) => i + 1)

  const combinations = cartesian({
    model: config.models,
    temperature: temperatures,
    seed: seeds,
  })

  const inputs = await config.inputs()

  const totalPermutations = combinations.length * inputs.length

  const shouldUseBatch = config.batch?.enabled === true || 
    (typeof config.batch?.enabled === 'number' && totalPermutations >= config.batch.enabled)

  if (shouldUseBatch) {
    return processBatchExperiment(name, config, combinations, inputs)
  }

  const results: ExperimentEvaluationResult[] = []
  for (const input of inputs) {
    for (const { model, temperature, seed } of combinations) {
      const prompts = config.prompt({ input })

      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputs.indexOf(input)}`

      try {
        const evaluationParams = {
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected,
          schema: config.schema,
          scorers: config.scorers,
        }

        const evaluationResult = await runEvaluation(evaluationParams)

        results.push({
          id: evaluationId,
          model,
          temperature,
          seed,
          input,
          result: evaluationResult,
        })
      } catch (error) {
        console.error(`Error evaluating ${evaluationId}:`, error)
        results.push({
          id: evaluationId,
          model,
          temperature,
          seed,
          input,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  return {
    name,
    timestamp: new Date().toISOString(),
    config: {
      models: config.models,
      temperatures,
      seeds,
      totalInputs: inputs.length,
    },
    results,
    summary: generateSummary(results, config.scorers),
  }
}

async function runEvaluation(params: EvaluationParams): Promise<EvaluationResult> {
  return {
    score: Math.random(), // Placeholder score
    details: {
      matches: true,
      comparison: 'Placeholder comparison result',
    },
  }
}

/**
 * Process an experiment using batch processing
 */
async function processBatchExperiment<T, E>(
  name: string,
  config: {
    models: string[]
    temperature: number | number[]
    seeds: number
    prompt: (params: { input: any }) => string[]
    inputs: () => Promise<T[]>
    expected: E
    schema: any
    scorers: any[]
    batch?: {
      enabled: boolean | number
      provider?: string
      providerConfig?: Record<string, any>
    }
  },
  combinations: Array<{ model: string; temperature: number; seed: number }>,
  inputs: T[]
) {
  try {
    const { createBatchConfig, submitBatch, collectBatchResults, formatExperimentResults } = await import('./batch.js')

    const provider = config.batch?.provider || 'openai'

    // Create batch configuration
    const batchConfig = await createBatchConfig(name, config, combinations, inputs, provider)

    const batchResult = await submitBatch(name, provider, batchConfig)

    if (!batchResult || typeof batchResult !== 'object' || !('id' in batchResult)) {
      throw new Error('Invalid batch creation response: missing id')
    }

    const batchResults = await collectBatchResults(batchResult.id as string)

    return formatExperimentResults(name, config, batchResults, inputs)
  } catch (error) {
    console.error('Error in batch processing:', error)
    throw error
  }
}

function generateSummary(results: ExperimentEvaluationResult[], scorers: any[]): ExperimentSummary {
  const groupedResults: Record<string, Record<string, any[]>> = {}

  for (const result of results) {
    if (result.error) continue // Skip failed evaluations

    const { model, temperature } = result

    if (!groupedResults[model]) {
      groupedResults[model] = {}
    }

    const tempKey = String(temperature)
    if (!groupedResults[model][tempKey]) {
      groupedResults[model][tempKey] = []
    }

    groupedResults[model][tempKey].push(result)
  }

  const summary: Record<string, Record<string, { avgScore: number; count: number }>> = {}

  for (const [model, temperatures] of Object.entries(groupedResults)) {
    summary[model] = {}

    for (const [temp, results] of Object.entries(temperatures)) {
      const scores = results.filter((r) => r.result && typeof r.result.score === 'number').map((r) => r.result.score)

      const avgScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0

      summary[model][temp] = {
        avgScore,
        count: results.length,
      }
    }
  }

  return summary
}
