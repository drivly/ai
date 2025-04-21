import { API } from 'apis.do'
import { ExperimentEvaluationResult, EvaluationParams, EvaluationResult, ExperimentSummary } from './types.js'

interface BattleScorer {
  name: string
  score: (output: any, expected: any) => { score: number; details: Record<string, any> }
}

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
  },
){
  const temperatures = Array.isArray(config.temperature) ? config.temperature : [config.temperature]

  const seeds = Array.from({ length: config.seeds }, (_, i) => i + 1)

  const combinations = cartesian({
    model: config.models,
    temperature: temperatures,
    seed: seeds,
  })

  const inputs = await config.inputs()
  const results: ExperimentEvaluationResult[] = []
  
  const needsBaselines = !config.expected || !config.scorers || config.scorers.length === 0
  
  const baselineOutputs: Record<number, any> = {}
  let battleScorer: BattleScorer | undefined = undefined
  
  if (needsBaselines && combinations.length > 0) {
    const firstVariation = combinations[0]
    const { model, temperature, seed } = firstVariation
    
    for (const input of inputs) {
      const inputIndex = inputs.indexOf(input)
      const prompts = config.prompt({ input })
      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputIndex}_baseline`
      
      try {
        const evaluationParams: EvaluationParams = {
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected || {},
          schema: config.schema,
          scorers: config.scorers || [],
        }
        
        const evaluationResult = await runEvaluation(evaluationParams)
        
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
    
    battleScorer = {
      name: 'Battle',
      score: (output: any, expected: any) => {
        const matches = JSON.stringify(output) === JSON.stringify(expected)
        return {
          score: matches ? 1 : 0,
          details: {
            matches,
            comparison: `Comparing output to baseline`,
          },
        }
      },
    }
  }
  
  const combinationsToProcess = needsBaselines ? combinations.slice(1) : combinations
  
  for (const input of inputs) {
    const inputIndex = inputs.indexOf(input)
    
    for (const { model, temperature, seed } of combinationsToProcess) {
      const prompts = config.prompt({ input })
      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputIndex}`
      
      try {
        const evaluationParams: EvaluationParams = {
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected || baselineOutputs[inputIndex] || {},
          schema: config.schema,
          scorers: config.scorers || (battleScorer ? [battleScorer] : []),
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
    summary: generateSummary(results, config.scorers || []),
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
