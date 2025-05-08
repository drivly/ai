import { describe, it, expect, vi } from 'vitest'
import { 
  getBenchmarkForModel,
  getBenchmarksByCategory,
  compareBenchmarks,
  filterModelsByMinScore,
  getTopModelsForBenchmark,
  getTopPerformingModels
} from '../src/benchmark-utils'

vi.mock('../src/benchmarks', () => {
  return {
    default: {
      models: {
        'openai/gpt-4.1': {
          modelSlug: 'openai/gpt-4.1',
          benchmarks: {
            'mmlu': { score: 95, timestamp: '2024-05-01' },
            'humaneval': { score: 85, timestamp: '2024-05-01' }
          },
          categories: {
            'reasoning': [
              { score: 95, timestamp: '2024-05-01' }
            ]
          },
          overallScore: 90
        },
        'anthropic/claude-3.5': {
          modelSlug: 'anthropic/claude-3.5',
          benchmarks: {
            'mmlu': { score: 90, timestamp: '2024-05-01' },
            'humaneval': { score: 80, timestamp: '2024-05-01' }
          },
          categories: {
            'reasoning': [
              { score: 90, timestamp: '2024-05-01' }
            ]
          },
          overallScore: 85
        }
      },
      lastUpdated: '2024-05-01T00:00:00.000Z',
      version: '1.0.0'
    }
  }
})

const mockBenchmarks = {
  'openai/gpt-4.1': {
    modelSlug: 'openai/gpt-4.1',
    benchmarks: {
      'mmlu': { score: 95, timestamp: '2024-05-01' },
      'humaneval': { score: 85, timestamp: '2024-05-01' }
    },
    categories: {
      'reasoning': [
        { score: 95, timestamp: '2024-05-01' }
      ]
    },
    overallScore: 90
  },
  'anthropic/claude-3.5': {
    modelSlug: 'anthropic/claude-3.5',
    benchmarks: {
      'mmlu': { score: 90, timestamp: '2024-05-01' },
      'humaneval': { score: 80, timestamp: '2024-05-01' }
    },
    categories: {
      'reasoning': [
        { score: 90, timestamp: '2024-05-01' }
      ]
    },
    overallScore: 85
  }
}

describe('benchmark-utils', () => {
  it('should get benchmark data for a specific model', () => {
    const result = getBenchmarkForModel('openai/gpt-4.1', mockBenchmarks)
    expect(result).toBeDefined()
    expect(result?.modelSlug).toBe('openai/gpt-4.1')
    expect(result?.benchmarks.mmlu.score).toBe(95)
  })

  it('should get benchmark results for a specific category', () => {
    const results = getBenchmarksByCategory('reasoning', mockBenchmarks)
    expect(Object.keys(results).length).toBe(2)
    expect(results['openai/gpt-4.1']).toBeDefined()
    expect(results['anthropic/claude-3.5']).toBeDefined()
    expect(results['openai/gpt-4.1'][0].score).toBe(95)
    expect(results['anthropic/claude-3.5'][0].score).toBe(90)
  })

  it('should compare benchmark results between models', () => {
    const comparison = compareBenchmarks(['openai/gpt-4.1', 'anthropic/claude-3.5'], 'mmlu', mockBenchmarks)
    expect(comparison['openai/gpt-4.1']).toBeDefined()
    expect(comparison['anthropic/claude-3.5']).toBeDefined()
    expect(comparison['openai/gpt-4.1']?.score).toBe(95)
    expect(comparison['anthropic/claude-3.5']?.score).toBe(90)
  })

  it('should filter models by minimum benchmark score', () => {
    const filtered = filterModelsByMinScore('mmlu', 95, mockBenchmarks)
    expect(filtered).toEqual(['openai/gpt-4.1'])
  })

  it('should get top models for a specific benchmark', () => {
    const topModels = getTopModelsForBenchmark('mmlu', mockBenchmarks)
    expect(topModels.length).toBe(2)
    expect(topModels[0]).toBe('openai/gpt-4.1')
    expect(topModels[1]).toBe('anthropic/claude-3.5')
  })

  it('should get top performing models by overall score', () => {
    const topModels = getTopPerformingModels(mockBenchmarks)
    expect(topModels.length).toBe(2)
    expect(topModels[0]).toBe('openai/gpt-4.1')
    expect(topModels[1]).toBe('anthropic/claude-3.5')
  })
})
