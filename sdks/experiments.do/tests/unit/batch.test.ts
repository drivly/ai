import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createBatchConfig, formatExperimentResults } from '../../src/batch.js'

describe('createBatchConfig', () => {
  it('should create batch config for OpenAI', async () => {
    const name = 'test-batch'
    const config = {
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      providerConfig: { system: 'Test system' },
    }
    const combinations = [
      { model: 'gpt-4', temperature: 0, seed: 1 },
      { model: 'gpt-4', temperature: 0.5, seed: 2 },
    ]
    const inputs = ['input1', 'input2']
    const provider = 'openai'

    const result = await createBatchConfig(name, config, combinations, inputs, provider)

    expect(result.input_data).toHaveLength(4) // 2 combinations * 2 inputs
    expect(result.input_data[0].model).toBe('gpt-4')
    expect(result.input_data[0].temperature).toBe(0)
    expect(result.input_data[0].seed).toBe(1)
    expect(result.input_data[0].input_id).toBe('0_gpt-4_0_1')
  })

  it('should create batch config for Anthropic', async () => {
    const name = 'test-batch'
    const config = {
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      providerConfig: { system: 'Test system' },
    }
    const combinations = [{ model: 'claude-3', temperature: 0, seed: 1 }]
    const inputs = ['input1']
    const provider = 'anthropic'

    const result = await createBatchConfig(name, config, combinations, inputs, provider)

    expect(result.input_data).toHaveLength(1)
    expect(result.input_data[0].model).toBe('claude-3')
    expect(result.input_data[0].temperature).toBe(0)
    expect(result.input_data[0].system).toBe('Test system')
  })
})

describe('formatExperimentResults', () => {
  it('should format batch results to match experiment output', () => {
    const name = 'test-experiment'
    const config = {
      models: ['gpt-4'],
      temperature: [0],
      seeds: 1,
      scorers: [],
    }
    const results = [
      {
        input_id: '0_gpt-4_0_1',
        content: 'Test response',
        score: 0.8,
      },
    ]
    const inputs = ['input1']

    const formattedResults = formatExperimentResults(name, config, results, inputs)

    expect(formattedResults.name).toBe('test-experiment')
    expect(formattedResults.results).toHaveLength(1)
    expect(formattedResults.results[0].model).toBe('gpt-4')
    expect(formattedResults.results[0].temperature).toBe(0)
    expect(formattedResults.results[0].seed).toBe(1)
    expect(formattedResults.results[0].input).toBe('input1')
    expect(formattedResults.results[0].result.score).toBe(0.8)
  })

  it('should handle errors in batch results', () => {
    const name = 'test-experiment'
    const config = {
      models: ['gpt-4'],
      temperature: [0],
      seeds: 1,
      scorers: [],
    }
    const results = [
      {
        input_id: '0_gpt-4_0_1',
        error: 'Test error',
      },
    ]
    const inputs = ['input1']

    const formattedResults = formatExperimentResults(name, config, results, inputs)

    expect(formattedResults.results).toHaveLength(1)
    expect(formattedResults.results[0].error).toBe('Test error')
  })
})
