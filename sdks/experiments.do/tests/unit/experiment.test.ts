import { describe, it, expect, vi } from 'vitest'
import { cartesian, experiment } from '../../src/experiment.js'

describe('cartesian', () => {
  it('should generate all combinations of parameters', () => {
    const result = cartesian({
      model: ['gpt-4', 'claude-3'],
      temperature: [0, 0.2],
      seed: [1, 2, 3],
    })

    expect(result).toHaveLength(12) // 2 models * 2 temperatures * 3 seeds
    expect(result).toContainEqual({ model: 'gpt-4', temperature: 0, seed: 1 })
    expect(result).toContainEqual({ model: 'gpt-4', temperature: 0, seed: 2 })
    expect(result).toContainEqual({ model: 'gpt-4', temperature: 0, seed: 3 })
    expect(result).toContainEqual({ model: 'gpt-4', temperature: 0.2, seed: 1 })
    expect(result).toContainEqual({ model: 'gpt-4', temperature: 0.2, seed: 2 })
    expect(result).toContainEqual({ model: 'gpt-4', temperature: 0.2, seed: 3 })
    expect(result).toContainEqual({ model: 'claude-3', temperature: 0, seed: 1 })
    expect(result).toContainEqual({ model: 'claude-3', temperature: 0, seed: 2 })
    expect(result).toContainEqual({ model: 'claude-3', temperature: 0, seed: 3 })
    expect(result).toContainEqual({ model: 'claude-3', temperature: 0.2, seed: 1 })
    expect(result).toContainEqual({ model: 'claude-3', temperature: 0.2, seed: 2 })
    expect(result).toContainEqual({ model: 'claude-3', temperature: 0.2, seed: 3 })
  })

  it('should handle empty parameters', () => {
    const result = cartesian({})
    expect(result).toEqual([])
  })

  it('should handle single parameter', () => {
    const result = cartesian({
      model: ['gpt-4', 'claude-3'],
    })
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ model: 'gpt-4' })
    expect(result).toContainEqual({ model: 'claude-3' })
  })
})

describe('experiment', () => {
  it('should expand scalar temperature to array', async () => {
    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4'],
      temperature: 0.5, // scalar value
      seeds: 1,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
      scorers: [{ name: 'scorer1' }],
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.config.temperatures).toEqual([0.5])
    expect(mockConfig.inputs).toHaveBeenCalledTimes(1)
  })

  it('should generate correct number of evaluations', async () => {
    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4', 'claude-3'],
      temperature: [0, 0.5],
      seeds: 2,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
      scorers: [{ name: 'scorer1' }],
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.results).toHaveLength(16)
    expect(mockConfig.inputs).toHaveBeenCalledTimes(1)
  })

  it('should use batch processing when enabled', async () => {
    vi.mock('../../src/batch.js', () => ({
      createBatchConfig: vi.fn().mockResolvedValue({ input_data: [] }),
      submitBatch: vi.fn().mockResolvedValue({ id: 'batch-123' }),
      collectBatchResults: vi.fn().mockResolvedValue([]),
      formatExperimentResults: vi.fn().mockReturnValue({
        name: 'test-experiment',
        timestamp: '2023-01-01T00:00:00.000Z',
        config: {
          models: ['gpt-4'],
          temperatures: [0.5],
          seeds: [1],
          totalInputs: 2,
        },
        results: [],
        summary: {},
      }),
    }))

    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4'],
      temperature: 0.5,
      seeds: 1,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
      scorers: [{ name: 'scorer1' }],
      batch: {
        enabled: true,
        provider: 'openai',
      },
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.name).toBe('test-experiment')
    expect(mockConfig.inputs).toHaveBeenCalledTimes(1)
  })

  it('should use batch processing when permutations exceed threshold', async () => {
    vi.mock('../../src/batch.js', () => ({
      createBatchConfig: vi.fn().mockResolvedValue({ input_data: [] }),
      submitBatch: vi.fn().mockResolvedValue({ id: 'batch-123' }),
      collectBatchResults: vi.fn().mockResolvedValue([]),
      formatExperimentResults: vi.fn().mockReturnValue({
        name: 'test-experiment',
        timestamp: '2023-01-01T00:00:00.000Z',
        config: {
          models: ['gpt-4', 'claude-3'],
          temperatures: [0, 0.5],
          seeds: [1, 2],
          totalInputs: 2,
        },
        results: [],
        summary: {},
      }),
    }))

    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4', 'claude-3'],
      temperature: [0, 0.5],
      seeds: 2,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
      scorers: [{ name: 'scorer1' }],
      batch: {
        enabled: 5, // Threshold of 5 permutations
        provider: 'anthropic',
      },
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.name).toBe('test-experiment')
    expect(mockConfig.inputs).toHaveBeenCalledTimes(1)
  })
})
