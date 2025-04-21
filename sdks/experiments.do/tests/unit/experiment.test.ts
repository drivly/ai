import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cartesian, experiment } from '../../src/experiment.js'
import { API } from 'apis.do'

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => {
      return {
        post: vi.fn().mockResolvedValue({
          data: {
            choices: [
              {
                message: {
                  content: 'Mocked model response'
                }
              }
            ]
          }
        })
      }
    })
  }
})

const TEST_TIMEOUT = 15000

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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should expand scalar temperature to array', async () => {
    const mockInputs = ['input1']
    const mockConfig = {
      models: ['gpt-4'],
      temperature: 0.5, // scalar value
      seeds: 1,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
      scorers: [
        vi.fn().mockImplementation(async () => ({ score: 0.8, details: { matches: true } }))
      ],
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.config.temperatures).toEqual([0.5])
    expect(mockConfig.inputs).toHaveBeenCalledTimes(1)
  }, TEST_TIMEOUT)

  it('should generate correct number of evaluations', async () => {
    const mockInputs = ['input1']
    const mockConfig = {
      models: ['gpt-4', 'claude-3'],
      temperature: [0, 0.5],
      seeds: 2,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
      scorers: [
        vi.fn().mockImplementation(async () => ({ score: 0.8, details: { matches: true } }))
      ],
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.results).toHaveLength(8)
    expect(mockConfig.inputs).toHaveBeenCalledTimes(1)
  }, TEST_TIMEOUT)

  it('should create baselines when expected is not provided', async () => {
    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4', 'claude-3'],
      temperature: 0.5,
      seeds: 1,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      schema: { type: 'object' },
      scorers: [{ name: 'scorer1' }],
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.results).toHaveLength(4)
    
    const baselineResults = result.results.filter(r => r.id.includes('baseline'))
    expect(baselineResults).toHaveLength(2) // One baseline per input
  }, TEST_TIMEOUT)

  it('should create baselines when scorers are not provided', async () => {
    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4', 'claude-3'],
      temperature: 0.5,
      seeds: 1,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      expected: 'expected result',
      schema: { type: 'object' },
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.results).toHaveLength(4)
    
    const baselineResults = result.results.filter(r => r.id.includes('baseline'))
    expect(baselineResults).toHaveLength(2) // One baseline per input
  }, TEST_TIMEOUT)

  it('should create baselines when both expected and scorers are not provided', async () => {
    const mockInputs = ['input1', 'input2']
    const mockConfig = {
      models: ['gpt-4', 'claude-3'],
      temperature: 0.5,
      seeds: 1,
      prompt: ({ input }: { input: string }) => [`Prompt for ${input}`],
      inputs: vi.fn().mockResolvedValue(mockInputs),
      schema: { type: 'object' },
    }

    const result = await experiment('test-experiment', mockConfig)

    expect(result.results).toHaveLength(4)
    
    const baselineResults = result.results.filter(r => r.id.includes('baseline'))
    expect(baselineResults).toHaveLength(2) // One baseline per input
    
    const nonBaselineResults = result.results.filter(r => !r.id.includes('baseline'))
    expect(nonBaselineResults).toHaveLength(2) // One evaluation per input for the second model
  }, TEST_TIMEOUT)
})
