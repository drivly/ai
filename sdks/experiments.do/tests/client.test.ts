import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExperimentsClient } from '../src/client'
import { API } from 'apis.do'
import { VercelFlagsProvider } from '../src/provider'
import { Experiment } from '../src/types'

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      create: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      post: vi.fn().mockResolvedValue({ success: true }),
      get: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      list: vi.fn().mockResolvedValue({ data: [] }),
      getById: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      update: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      remove: vi.fn().mockResolvedValue({ success: true }),
    })),
    client: {
      create: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      post: vi.fn().mockResolvedValue({ success: true }),
      get: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      list: vi.fn().mockResolvedValue({ data: [] }),
      getById: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      update: vi.fn().mockResolvedValue({ name: 'test-experiment' }),
      remove: vi.fn().mockResolvedValue({ success: true }),
    }
  }
})

vi.mock('../src/provider', () => {
  return {
    VercelFlagsProvider: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      createFlag: vi.fn().mockResolvedValue({ name: 'test-flag' }),
      getFlag: vi.fn().mockResolvedValue({ name: 'test-flag' }),
      evaluateFlag: vi.fn().mockResolvedValue({ variant: 'control', value: { enabled: true } }),
      recordMetric: vi.fn().mockResolvedValue({ success: true }),
      getResults: vi.fn().mockResolvedValue({ variants: { control: { metrics: { conversion: { mean: 0.5 } } } } }),
      resolveObjectEvaluation: vi.fn().mockResolvedValue({ value: { enabled: true }, variant: 'control' }),
    })),
  }
})

describe('ExperimentsClient', () => {
  let client: ExperimentsClient

  beforeEach(() => {
    client = new ExperimentsClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-api.com',
    })
  })

  it('should create an instance with default options', () => {
    const defaultClient = new ExperimentsClient()
    expect(defaultClient).toBeDefined()
  })

  it('should create an experiment and corresponding flag', async () => {
    const experiment = {
      name: 'test-experiment',
      description: 'Test experiment',
      variants: [
        {
          id: 'control',
          description: 'Control variant',
          config: { enabled: false },
        },
        {
          id: 'treatment',
          description: 'Treatment variant',
          config: { enabled: true },
        },
      ],
      metrics: [
        {
          name: 'conversion',
          description: 'Conversion rate',
          higherIsBetter: true,
        },
      ],
      trafficAllocation: {
        type: 'percentage',
        values: {
          control: 50,
          treatment: 50,
        },
      },
    } satisfies Experiment

    const result = await client.create(experiment)
    expect(result).toEqual({ name: 'test-experiment' })
  })

  it('should get a variant for a specific context', async () => {
    const context = {
      userId: 'user-123',
      sessionId: 'session-456',
    }

    const result = await client.getVariant('test-experiment', context)
    expect(result).toEqual({ id: 'control', config: { enabled: true } })
  })

  it('should record metrics for a variant', async () => {
    const metrics = {
      conversion: 1,
      latency: 450,
    }

    const result = await client.track('test-experiment', 'control', metrics)
    expect(result).toEqual({ success: true })
  })

  it('should get experiment results', async () => {
    const result = await client.getResults('test-experiment')
    expect(result).toEqual({
      name: 'test-experiment',
      variants: { control: { metrics: { conversion: { mean: 0.5 } } } },
    })
  })
})
