import { API } from 'apis.do'
import { ExperimentEvaluationResult, EvaluationParams, EvaluationResult, ExperimentSummary } from './types.js'

/**
 * Generates all possible combinations (cartesian product) of values from arrays in an object
 * @param spec - An object with arrays as values
 * @returns An array of objects representing all possible combinations
 * @example
 * cartesian({ color: ['red', 'blue'], size: ['S', 'M'] })
 * // Returns: [
 * //   { color: 'red', size: 'S' },
 * //   { color: 'red', size: 'M' },
 * //   { color: 'blue', size: 'S' },
 * //   { color: 'blue', size: 'M' }
 * // ]
 */
export function cartesian<
  T extends Record<string, readonly any[]>
>(spec: T): Array<{ [K in keyof T]: T[K][number] }> {
  const keys = Object.keys(spec) as Array<keyof T>;
  
  if (keys.length === 0) return [] as Array<{ [K in keyof T]: T[K][number] }>;

  return keys.reduce<Array<Record<string, any>>>(
    (acc, key) => {
      const values = spec[key];
      return acc.flatMap(combo =>
        values.map(value => ({ ...combo, [key]: value }))
      );
    },
    [{}],
  ) as Array<{ [K in keyof T]: T[K][number] }>;
}

/**
 * Runs an experiment with multiple parameter variations.
 * @param name The name of the experiment
 * @param config The experiment configuration
 * @param config.models Array of model identifiers to test
 * @param config.temperature Temperature value(s) to test
 * @param config.seeds Number of random seeds to test
 * @param config.prompt Function that generates prompts for each input
 * @param config.inputs Function that returns the inputs to test
 * @param config.expected Optional expected results. If not provided, the first variation will be used as a baseline
 * @param config.schema Schema for validating outputs
 * @param config.scorers Optional scoring functions. If not provided, a Battle-like scorer will be created to compare against baselines
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
    expected?: E
    schema: any
    scorers?: any[]
    batch?: {
      enabled: boolean | number
      provider?: string
      providerConfig?: Record<string, any>
    }
  },
){
  const temperatures = Array.isArray(config.temperature) ? config.temperature : (config.temperature === undefined ? [0.7] : [config.temperature])
  const seeds = Array.from({ length: config.seeds }, (_, i) => i + 1)
  
  const combinations = cartesian({
    model: config.models,
    temperature: temperatures,
    seed: seeds,
  })

  const inputs = await config.inputs()
  
  const api = new API({ baseUrl: 'https://llm.do/api' })
  
  const totalPermutations = combinations.length * inputs.length

  const shouldUseBatch = config.batch?.enabled === true || 
    (typeof config.batch?.enabled === 'number' && totalPermutations >= config.batch.enabled)

  if (shouldUseBatch) {
    return processBatchExperiment(name, config, combinations, inputs)
  }
  const results: ExperimentEvaluationResult[] = []
  
  const needsBaselines = !config.expected || !config.scorers || config.scorers.length === 0
  
  const baselineOutputs: Record<number, any> = {}
  let battleScorer: any = undefined
  
  if (needsBaselines && combinations.length > 0) {
    const firstVariation = combinations[0]
    const { model, temperature, seed } = firstVariation
    
    for (const input of inputs) {
      const inputIndex = inputs.indexOf(input)
      const prompts = config.prompt({ input })
      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputIndex}_baseline`
      
      try {
        const evaluationResult = await runEvaluation({
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected || {},
          schema: config.schema,
          scorers: config.scorers || [],
          api,
        })
        
        baselineOutputs[inputIndex] = evaluationResult
        
        results.push({
          id: evaluationId,
          model,
          temperature,
          seed,
          input,
          result: evaluationResult,
        })
      } catch (error) {
        console.error(`Error creating baseline for input ${inputIndex}:`, error)
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
    
    // Create a Battle-like scorer function that compares outputs against baselines
    function Battle({ output, expected }: { output: any, expected: any }) {
      const matches = JSON.stringify(output) === JSON.stringify(expected)
      return {
        score: matches ? 1 : 0,
        details: {
          matches,
          comparison: `Comparing output to baseline`,
        },
      }
    }
    
    battleScorer = Battle
  }
  
  const combinationsToProcess = needsBaselines ? combinations.slice(1) : combinations
  
  for (const input of inputs) {
    const inputIndex = inputs.indexOf(input)
    
    for (const { model, temperature, seed } of combinationsToProcess) {
      const prompts = config.prompt({ input })
      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputIndex}`
      
      try {
        const evaluationResult = await runEvaluation({
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected || baselineOutputs[inputIndex] || {},
          schema: config.schema,
          scorers: config.scorers || (battleScorer ? [battleScorer] : []),
          api,
        })
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
    summary: generateSummary(results, config.scorers || []),
  }
}

/**
 * Runs a single evaluation using the provided parameters.
 * This implementation uses evalite patterns but without direct dependency.
 */
async function runEvaluation(params: EvaluationParams & { api: API }): Promise<EvaluationResult> {
  const { model, temperature, seed, prompts, input, expected, schema, scorers, api } = params
  
  try {
    const response = await api.post('/completions', {
      model,
      temperature,
      seed,
      messages: [{ role: 'user', content: prompts.join('\n\n') }],
    })
    
    const responseData = response as unknown as { 
      data?: { 
        choices?: Array<{ message?: { content?: string } }> 
      } 
    }
    
    const modelOutput = responseData.data?.choices?.[0]?.message?.content || ''
    
    const scores = await Promise.all(
      scorers.map(async (scorer) => {
        try {
          const result = await scorer({
            input,
            output: modelOutput,
            expected,
            schema,
          })
          
          return {
            name: scorer.name || 'unnamed_scorer',
            score: typeof result === 'number' ? result : result.score || 0,
            details: typeof result === 'object' && result !== null ? (result.details || {}) : {},
          }
        } catch (error) {
          console.error(`Error applying scorer ${scorer.name || 'unnamed'}:`, error)
          return {
            name: scorer.name || 'unnamed_scorer',
            score: 0,
            details: { error: error instanceof Error ? error.message : String(error) },
          }
        }
      })
    )
    
    const overallScore = scores.length > 0
      ? scores.reduce((sum: number, score) => sum + score.score, 0) / scores.length
      : 0
    
    const details = scores.reduce((acc: Record<string, any>, score) => {
      acc[score.name] = score.details
      return acc
    }, {})
    
    return {
      score: overallScore,
      details,
    }
  } catch (error) {
    throw error
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
    expected?: E
    schema: any
    scorers?: any[]
    batch?: {
      enabled: boolean | number
      provider?: string
      providerConfig?: Record<string, any>
    }
  },
  combinations: Array<{ model: string; temperature: number; seed: number }>,
  inputs: T[]
){
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
