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
  
  const api = new API({ baseUrl: 'https://llm.do/api' })
  
  const results: ExperimentEvaluationResult[] = []
  
  for (const input of inputs) {
    for (const { model, temperature, seed } of combinations) {
      const prompts = config.prompt({ input })
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
          scorers: config.scorers,
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
