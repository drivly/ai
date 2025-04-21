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
export function experiment<T, E>(
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
    batch?: {
      enabled: boolean | number
      provider?: string
      providerConfig?: Record<string, any>
    }
  },
) {
  // Handle new format vs old format
  if (config.data && !config.inputs) {
    console.log('Using alternative experiment API format for', name);
    // Immediately register with evalite instead of returning
    legacyExperiment(name, config as any);
    return;
  }
  
  // Instead of executing the experiment directly, we'll register it with evalite
  // Import evalite dynamically to ensure proper test registration
  import('evalite').then(({ evalite }) => {
    evalite(name, {
      data: async () => {
        if (config.data) return config.data
        
        const temperatures = Array.isArray(config.temperature) ? config.temperature : [config.temperature]
        const seeds = config.seeds ? Array.from({ length: config.seeds }, (_, i) => i + 1) : [1]
        
        const combinations = cartesian({
          model: config.models,
          temperature: temperatures,
          seed: seeds,
        })

        const inputs = config.inputs ? await config.inputs() : []
        
        // Create all permutations for evalite to test
        return combinations.flatMap(combo => 
          inputs.map(input => ({
            input: {
              ...combo,
              input,
              system: config.system,
              schema: config.schema
            }
          }))
        )
      },
      task: async ({ model, temperature, seed, input, system, schema }) => {
        const api = new API({ baseUrl: 'https://llm.do/api' })
        const prompts = config.prompt ? (typeof config.prompt === 'function' ? config.prompt({ input }) : []) : []
        
        try {
          // Use the EvalLite API to run the evaluation
          const result = await api.fetch('/api/evaluate', {
            method: 'POST',
            body: JSON.stringify({
              model,
              temperature,
              seed,
              prompts,
              input,
              schema
            })
          }).then(r => r.json())
          
          return result
        } catch (error) {
          console.error(`Error in evaluation:`, error)
          throw error
        }
      },
      scorers: config.scorers || []
    })
  }).catch(error => {
    console.error(`Error registering experiment '${name}':`, error)
  })
  
  // Return undefined since we're just registering the test, not executing it directly
  return
  const results: ExperimentEvaluationResult[] = []
  
  const needsBaselines = !config.expected || !config.scorers || config.scorers?.length === 0
  
  const baselineOutputs: {
    byInput: Record<number, any>,
    byDimension: {
      model: Record<string, Record<number, any>>,
      temperature: Record<string, Record<number, any>>,
      seed: Record<string, Record<number, any>>
    }
  } = {
    byInput: {},
    byDimension: {
      model: {},
      temperature: {},
      seed: {}
    }
  }
  
  let battleScorer: any = undefined
  
  function getDimensionToCompare(
    model: string, 
    temperature: number, 
    seed: number, 
    baselineVariation: { model: string; temperature: number; seed: number } | null
  ): string | null {
    if (!baselineVariation) return null;
    
    // If only the model is different, compare model dimension
    if (model !== baselineVariation.model && 
        temperature === baselineVariation.temperature && 
        seed === baselineVariation.seed) {
      return 'model';
    }
    
    // If only the temperature is different, compare temperature dimension
    if (model === baselineVariation.model && 
        temperature !== baselineVariation.temperature && 
        seed === baselineVariation.seed) {
      return 'temperature';
    }
    
    // If only the seed is different, compare seed dimension
    if (model === baselineVariation.model && 
        temperature === baselineVariation.temperature && 
        seed !== baselineVariation.seed) {
      return 'seed';
    }
    
    return null;
  }
  
  function getValueForDimension(
    model: string, 
    temperature: number, 
    seed: number, 
    dimension: string | null
  ): string | number | null {
    if (!dimension) return null;
    
    switch (dimension) {
      case 'model': return model;
      case 'temperature': return temperature;
      case 'seed': return seed;
      default: return null;
    }
  }
  
  if (needsBaselines && combinations.length > 0) {
    // Create baselines for each dimension
    const uniqueModels = [...new Set(combinations.map(c => c.model))]
    const uniqueTemperatures = [...new Set(combinations.map(c => c.temperature))]
    const uniqueSeeds = [...new Set(combinations.map(c => c.seed))]
    
    const baselineModel = uniqueModels[0]
    const baselineTemperature = uniqueTemperatures[0]
    const baselineSeed = uniqueSeeds[0]
    
    // Create baselines for each input using the first variation
    for (const input of inputs) {
      const inputIndex = inputs.indexOf(input)
      const prompts = config.prompt ? (typeof config.prompt === 'function' ? config.prompt({ input }) : []) : []
      
      // Create baseline for the first variation (used for backward compatibility)
      const firstVariationId = `${name}_${baselineModel}_${baselineTemperature}_${baselineSeed}_${inputIndex}_baseline`
      
      try {
        const firstVariationResult = await runEvaluation({
          id: firstVariationId,
          model: baselineModel,
          temperature: baselineTemperature,
          seed: baselineSeed,
          prompts,
          input,
          expected: config.expected || {},
          schema: config.schema,
          scorers: config.scorers || [],
          api,
        })
        
        baselineOutputs.byInput[inputIndex] = firstVariationResult
        
        // Also store it in the dimension-specific baselines
        if (!baselineOutputs.byDimension.model[baselineModel]) {
          baselineOutputs.byDimension.model[baselineModel] = {}
        }
        baselineOutputs.byDimension.model[baselineModel][inputIndex] = firstVariationResult
        
        if (!baselineOutputs.byDimension.temperature[baselineTemperature]) {
          baselineOutputs.byDimension.temperature[baselineTemperature] = {}
        }
        baselineOutputs.byDimension.temperature[baselineTemperature][inputIndex] = firstVariationResult
        
        if (!baselineOutputs.byDimension.seed[baselineSeed]) {
          baselineOutputs.byDimension.seed[baselineSeed] = {}
        }
        baselineOutputs.byDimension.seed[baselineSeed][inputIndex] = firstVariationResult
        
        results.push({
          id: firstVariationId,
          model: baselineModel,
          temperature: baselineTemperature,
          seed: baselineSeed,
          input,
          result: firstVariationResult,
        })
      } catch (error) {
        console.error(`Error creating baseline for input ${inputIndex}:`, error)
        results.push({
          id: firstVariationId,
          model: baselineModel,
          temperature: baselineTemperature,
          seed: baselineSeed,
          input,
          error: error instanceof Error ? error.message : String(error),
        })
      }
      
      // Create baselines for other dimensions (other models, temperatures, seeds)
      for (const model of uniqueModels.slice(1)) {
        const modelBaselineId = `${name}_${model}_${baselineTemperature}_${baselineSeed}_${inputIndex}_model_baseline`
        
        try {
          const modelBaselineResult = await runEvaluation({
            id: modelBaselineId,
            model,
            temperature: baselineTemperature,
            seed: baselineSeed,
            prompts,
            input,
            expected: config.expected || {},
            schema: config.schema,
            scorers: config.scorers || [],
            api,
          })
          
          if (!baselineOutputs.byDimension.model[model]) {
            baselineOutputs.byDimension.model[model] = {}
          }
          baselineOutputs.byDimension.model[model][inputIndex] = modelBaselineResult
          
          // Don't add these to results to avoid duplicate evaluations
        } catch (error) {
          console.error(`Error creating model baseline for input ${inputIndex}:`, error)
        }
      }
      
      for (const temperature of uniqueTemperatures.slice(1)) {
        const tempBaselineId = `${name}_${baselineModel}_${temperature}_${baselineSeed}_${inputIndex}_temp_baseline`
        
        try {
          const tempBaselineResult = await runEvaluation({
            id: tempBaselineId,
            model: baselineModel,
            temperature,
            seed: baselineSeed,
            prompts,
            input,
            expected: config.expected || {},
            schema: config.schema,
            scorers: config.scorers || [],
            api,
          })
          
          if (!baselineOutputs.byDimension.temperature[temperature]) {
            baselineOutputs.byDimension.temperature[temperature] = {}
          }
          baselineOutputs.byDimension.temperature[temperature][inputIndex] = tempBaselineResult
          
          // Don't add these to results to avoid duplicate evaluations
        } catch (error) {
          console.error(`Error creating temperature baseline for input ${inputIndex}:`, error)
        }
      }
      
      for (const seed of uniqueSeeds.slice(1)) {
        const seedBaselineId = `${name}_${baselineModel}_${baselineTemperature}_${seed}_${inputIndex}_seed_baseline`
        
        try {
          const seedBaselineResult = await runEvaluation({
            id: seedBaselineId,
            model: baselineModel,
            temperature: baselineTemperature,
            seed,
            prompts,
            input,
            expected: config.expected || {},
            schema: config.schema,
            scorers: config.scorers || [],
            api,
          })
          
          if (!baselineOutputs.byDimension.seed[seed]) {
            baselineOutputs.byDimension.seed[seed] = {}
          }
          baselineOutputs.byDimension.seed[seed][inputIndex] = seedBaselineResult
          
          // Don't add these to results to avoid duplicate evaluations
        } catch (error) {
          console.error(`Error creating seed baseline for input ${inputIndex}:`, error)
        }
      }
    }
    
    // Enhanced Battle-like scorer function that compares outputs against dimension-specific baselines
    function Battle({ output, expected, dimension, value, inputIndex }: { 
      output: any, 
      expected: any,
      dimension?: string | null,
      value?: string | number | null,
      inputIndex?: number
    }) {
      if (dimension && value !== undefined && value !== null && inputIndex !== undefined) {
        const dimensionBaselines = baselineOutputs.byDimension[dimension as keyof typeof baselineOutputs.byDimension]
        if (dimensionBaselines && dimensionBaselines[String(value)] && dimensionBaselines[String(value)][inputIndex]) {
          const dimensionBaseline = dimensionBaselines[String(value)][inputIndex]
          const matches = JSON.stringify(output) === JSON.stringify(dimensionBaseline)
          return {
            score: matches ? 1 : 0,
            details: {
              matches,
              comparison: `Comparing output to ${dimension} baseline (${value})`,
              baseline: dimensionBaseline
            },
          }
        }
      }
      
      const matches = JSON.stringify(output) === JSON.stringify(expected)
      return {
        score: matches ? 1 : 0,
        details: {
          matches,
          comparison: `Comparing output to baseline`,
          baseline: expected
        },
      }
    }
    
    battleScorer = Battle
  }
  
  const firstVariation = combinations.length > 0 ? combinations[0] : null
  const combinationsToProcess = needsBaselines && firstVariation 
    ? combinations.filter(combo => {
        return !(combo.model === firstVariation.model && 
                combo.temperature === firstVariation.temperature && 
                combo.seed === firstVariation.seed)
      }) 
    : combinations
  
  for (const input of inputs) {
    const inputIndex = inputs.indexOf(input)
    
    for (const { model, temperature, seed } of combinationsToProcess) {
      const prompts = config.prompt ? (typeof config.prompt === 'function' ? config.prompt({ input }) : []) : []
      const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputIndex}`
      
      try {
        const evaluationResult = await runEvaluation({
          id: evaluationId,
          model,
          temperature,
          seed,
          prompts,
          input,
          expected: config.expected || (baselineOutputs.byInput[inputIndex] || {}),
          schema: config.schema,
          scorers: config.scorers || (battleScorer ? [
            (params: any) => battleScorer({
              ...params,
              dimension: getDimensionToCompare(model, temperature, seed, firstVariation),
              value: getValueForDimension(model, temperature, seed, getDimensionToCompare(model, temperature, seed, firstVariation)),
              inputIndex
            })
          ] : []),
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
 * Process an experiment using batch processing
 */
async function processBatchExperiment<T, E>(
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

/**
 * Implementation of the legacy experiment format that accepts data directly and other simplified parameters.
 * This format is used in files like content.eval.ts
 */
function legacyExperiment<T>(
  name: string,
  config: {
    models: string[]
    data?: any[]
    temperature: number | number[]
    system?: (string | undefined)[]
    prompt?: any
    schema?: any
    inputs?: () => Promise<any[]>
  }
) {
  console.log(`Registering legacy experiment: ${name}`);
  
  // Immediately import evalite and register the test
  import('evalite').then(({ evalite }) => {
    const temperatures = Array.isArray(config.temperature) ? config.temperature : [config.temperature]
    
    // Register the evalite test suite directly
    evalite(name, {
      data: async () => {
        // If data is provided directly, use it
        if (config.data && config.data.length > 0) {
          return config.data
        }
        
        // Otherwise use inputs function if provided
        if (config.inputs) {
          return config.inputs()
        }
        
        return []
      },
      
      task: async (input: any) => {
        try {
          const api = new API({ baseUrl: 'https://llm.do/api' })
          
          const model = input.model || config.models[0]
          
          const temperature = input.temperature || temperatures[0]
          
          const prompts = config.prompt ? 
            (typeof config.prompt === 'function' ? config.prompt({ input }) : []) : 
            [JSON.stringify(input)]
          
          const systemPrompt = Array.isArray(config.system) && config.system.length > 0 ? 
            config.system[0] : 
            undefined
          
          // Create messages array for the API
          const messages = []
          
          if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt })
          }
          
          messages.push({ role: 'user', content: prompts.join('\n\n') })
          
          const response = await api.post('/completions', {
            model,
            temperature,
            messages,
          })
          
          const responseData = response as unknown as { 
            data?: { 
              choices?: Array<{ message?: { content?: string } }> 
            } 
          }
          
          const content = responseData.data?.choices?.[0]?.message?.content || ''
          
          let parsedContent = content
          
          if (config.schema) {
            try {
              const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                              content.match(/```\n([\s\S]*?)\n```/) ||
                              content.match(/{[\s\S]*}/)
              
              if (jsonMatch) {
                parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0])
              } else {
                parsedContent = JSON.parse(content)
              }
              
              if (config.schema && typeof config.schema.parse === 'function') {
                parsedContent = config.schema.parse(parsedContent)
              }
            } catch (error) {
              console.error('Error parsing or validating content:', error)
              parsedContent = content
            }
          }
          
          return parsedContent
        } catch (error) {
          console.error('Error in task execution:', error)
          return { error: error instanceof Error ? error.message : String(error) }
        }
      },
      
      scorers: config.scorers || []
    });
  }).catch(error => {
    console.error(`Error registering experiment '${name}':`, error)
  });
}
/**
 * Generates a summary of experiment results
 * @param results Array of experiment evaluation results
 * @param scorers Array of scorer functions used in the evaluations
 * @returns Summary of experiment results
 */
export function generateSummary(results: ExperimentEvaluationResult[], scorers: any[] = []): ExperimentSummary {
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
  
  return {
    models: Object.keys(groupedResults),
    results: Object.entries(groupedResults).map(([model, results]) => ({
      model,
      results: Object.entries(results).map(([temperature, results]) => ({
        temperature: Number(temperature),
        averageScore: (results as any[]).reduce((sum, r) => sum + (r.result?.score || 0), 0) / results.length,
        count: results.length,
        successes: (results as any[]).filter(r => !r.error).length,
        errors: (results as any[]).filter(r => !!r.error).length,
      }))
    }))
  }
}

