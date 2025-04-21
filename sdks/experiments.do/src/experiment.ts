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
 * @returns The experiment results
 */
export async function experiment<T, E>(
  name: string,
  config: {
    models: string[]
    temperature: number | number[]
    seeds?: number
    prompt?: ((params: { input: any }) => string[]) | Function
    inputs?: () => Promise<T[]>
    expected?: E
    schema?: any
    scorers?: any[]
    data?: any[]
    system?: (string | undefined)[]
  },
) {
  // Handle new format vs old format
  if (config.data && !config.inputs) {
    console.log('Using alternative experiment API format for', name);
    return legacyExperiment(name, config as any);
  }
  
  const temperatures = Array.isArray(config.temperature) ? config.temperature : [config.temperature]
  const seeds = config.seeds ? Array.from({ length: config.seeds }, (_, i) => i + 1) : [1]
  
  const combinations = cartesian({
    model: config.models,
    temperature: temperatures,
    seed: seeds,
  })

  const inputs = config.inputs ? await config.inputs() : []
  
  const api = new API({ baseUrl: 'https://llm.do/api' })
  
  const results: ExperimentEvaluationResult[] = []
  
  for (const input of inputs) {
    for (const { model, temperature, seed } of combinations) {
      const prompts = config.prompt ? (typeof config.prompt === 'function' ? config.prompt({ input }) : []) : []
      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputs.indexOf(input)}`
      
      try {
        const evaluationResult = await runEvaluation({
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected,
          schema: config.schema,
          scorers: config.scorers || [],
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
    summary: generateSummary(results, config.scorers),
  }
}

/**
 * Runs a single evaluation using the provided parameters.
 * This implementation uses evalite patterns but without direct dependency.
 */
async function runEvaluation(params: EvaluationParams & { api: API }): Promise<EvaluationResult> {
  const { model, temperature, seed, prompts, input, expected, schema, scorers = [], api } = params
  
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
    
    const scorersToUse = scorers || [];
    const scores = await Promise.all(
      scorersToUse.map(async (scorer) => {
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
 * Implementation of the legacy experiment format that accepts data directly and other simplified parameters.
 * This format is used in files like content.eval.ts
 */
async function legacyExperiment<T>(
  name: string,
  config: {
    models: string[]
    data: any[]
    temperature: number | number[]
    system?: (string | undefined)[]
    prompt?: any
    schema?: any
  }
) {
  console.log(`Running legacy experiment: ${name}`);
  
  // Basic implementation that logs the configuration but doesn't actually run experiments
  // This is a placeholder until we implement the full conversion from the new format to the old
  console.log(`  - Models: ${config.models.length}`);
  console.log(`  - Data points: ${config.data.length}`);
  console.log(`  - Temperature: ${Array.isArray(config.temperature) ? config.temperature.join(', ') : config.temperature}`);
  
  if (config.system) {
    console.log(`  - System prompts: ${config.system.length}`);
  }
  
  return {
    name,
    timestamp: new Date().toISOString(),
    config: {
      models: config.models,
      temperatures: Array.isArray(config.temperature) ? config.temperature : [config.temperature],
      seeds: [1],  // Default seed
      totalInputs: config.data.length,
    },
    results: [],  // No actual results in this placeholder implementation
    summary: {
      overallScore: 0,
      modelPerformance: {},
      temperaturePerformance: {},
    }
  };
}

function generateSummary(results: ExperimentEvaluationResult[], scorers: any[] = []): ExperimentSummary {
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
