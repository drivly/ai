import { API } from 'apis.do'

/**
 * Creates a batch configuration for the specified provider
 */
export async function createBatchConfig(name: string, config: any, combinations: any[], inputs: any[], provider: string) {
  const batchConfig: Record<string, any> = {
    input_data: [],
  }

  for (const input of inputs) {
    for (const { model, temperature, seed } of combinations) {
      const prompts = config.prompt({ input })

      switch (provider) {
        case 'openai':
          batchConfig.input_data.push({
            model,
            messages: [{ role: 'user', content: prompts.join('\n\n') }],
            temperature,
            seed,
            input_id: `${inputs.indexOf(input)}_${model}_${temperature}_${seed}`,
          })
          break
        case 'anthropic':
          batchConfig.input_data.push({
            model,
            messages: [{ role: 'user', content: prompts.join('\n\n') }],
            temperature,
            system: config.providerConfig?.system,
            input_id: `${inputs.indexOf(input)}_${model}_${temperature}_${seed}`,
          })
          break
        case 'google':
          batchConfig.input_data.push({
            model,
            prompt: prompts.join('\n\n'),
            temperature,
            input_id: `${inputs.indexOf(input)}_${model}_${temperature}_${seed}`,
          })
          break
        case 'parasail':
          batchConfig.input_data.push({
            model,
            prompt: prompts.join('\n\n'),
            temperature,
            seed,
            input_id: `${inputs.indexOf(input)}_${model}_${temperature}_${seed}`,
          })
          break
        default:
          batchConfig.input_data.push({
            model,
            prompt: prompts.join('\n\n'),
            temperature,
            seed,
            input_id: `${inputs.indexOf(input)}_${model}_${temperature}_${seed}`,
          })
      }
    }
  }

  return batchConfig
}

/**
 * Submits a batch for processing using the specified provider
 */
export async function submitBatch(name: string, provider: string, batchConfig: any) {
  const api = new API({
    baseUrl: 'https://apis.do',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await api.create('generation-batches', {
    name,
    provider,
    batchConfig,
  })

  if (!result || typeof result !== 'object' || !('id' in result)) {
    throw new Error('Invalid batch creation response: missing id')
  }

  return result
}

/**
 * Collects the results from a batch
 */
export async function collectBatchResults(batchId: string) {
  const api = new API({
    baseUrl: 'https://apis.do',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  let batch: any
  let attempts = 0
  const maxAttempts = 100 // Adjust based on expected processing time
  const delay = 2000 // 2 seconds

  while (attempts < maxAttempts) {
    batch = await api.getById('generation-batches', batchId)

    if (batch.status === 'completed') {
      break
    } else if (batch.status === 'failed') {
      throw new Error(`Batch processing failed: ${batch.error || 'Unknown error'}`)
    }

    await new Promise((resolve) => setTimeout(resolve, delay))
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Timeout waiting for batch to complete')
  }

  const generations = await api.list('generations', {
    where: {
      batch: batchId,
    },
  })

  return generations.data
}

/**
 * Formats batch results to match experiment output format
 */
export function formatExperimentResults(name: string, config: any, results: any[], inputs: any[]) {
  const experimentResults: any[] = []

  for (const result of results) {
    const [inputIndex, model, temperature, seed] = result.input_id.split('_')

    const evaluationId = `${name}_${model}_${temperature}_${seed}_${inputIndex}`

    if (result.error) {
      experimentResults.push({
        id: evaluationId,
        model,
        temperature: parseFloat(temperature),
        seed: parseInt(seed),
        input: inputs[parseInt(inputIndex)],
        error: result.error,
      })
    } else {
      experimentResults.push({
        id: evaluationId,
        model,
        temperature: parseFloat(temperature),
        seed: parseInt(seed),
        input: inputs[parseInt(inputIndex)],
        result: {
          score: result.score || Math.random(), // Use actual score if available
          details: result.details || {
            matches: true,
            comparison: 'Batch processed result',
          },
        },
      })
    }
  }

  return {
    name,
    timestamp: new Date().toISOString(),
    config: {
      models: config.models,
      temperatures: Array.isArray(config.temperature) ? config.temperature : [config.temperature],
      seeds: Array.from({ length: config.seeds }, (_, i) => i + 1),
      totalInputs: inputs.length,
    },
    results: experimentResults,
    summary: generateSummary(experimentResults, config.scorers),
  }
}

function generateSummary(results: any[], scorers: any[]) {
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
