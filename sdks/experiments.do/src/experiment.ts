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
    seeds: number
    prompt: (params: { input: any }) => string[]
    inputs: () => Promise<T[]>
    expected: E
    schema: any
    scorers: any[]
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
