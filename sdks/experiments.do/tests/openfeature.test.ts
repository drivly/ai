import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VercelFlagsProvider, EvaluationContext } from '../src/provider'
import { ExperimentsClient } from '../src/client'

vi.mock('../../apis.do/index.js', () => {
  return {
    API: class MockAPI {
      post = vi.fn().mockResolvedValue({})
      get = vi.fn().mockResolvedValue({})
      create = vi.fn().mockResolvedValue({})
      list = vi.fn().mockResolvedValue({ data: [] })
      getById = vi.fn().mockResolvedValue({})
      update = vi.fn().mockResolvedValue({})
      remove = vi.fn().mockResolvedValue({})
    },
  }
})

describe('VercelFlagsProvider', () => {
  let provider: VercelFlagsProvider

  beforeEach(() => {
    provider = new VercelFlagsProvider({
      apiKey: 'test-api-key',
    })
  })

  it('should implement the OpenFeature Provider interface', () => {
    expect(provider.metadata).toBeDefined()
    expect(provider.metadata.name).toBe('Vercel Flags Provider')
    expect(provider.initialize).toBeDefined()
    expect(provider.resolveBooleanEvaluation).toBeDefined()
    expect(provider.resolveStringEvaluation).toBeDefined()
    expect(provider.resolveNumberEvaluation).toBeDefined()
    expect(provider.resolveObjectEvaluation).toBeDefined()
  })

  it('should resolve boolean evaluations', async () => {
    const mockEvaluateFlag = vi.spyOn(provider, 'evaluateFlag').mockResolvedValue({ variant: 'test-variant', value: true })

    const result = await provider.resolveBooleanEvaluation('test-flag', false, { userId: 'user-123' })

    expect(mockEvaluateFlag).toHaveBeenCalledWith('test-flag', { userId: 'user-123' })
    expect(result).toEqual({
      value: true,
      variant: 'test-variant',
    })
  })

  it('should resolve string evaluations', async () => {
    const mockEvaluateFlag = vi.spyOn(provider, 'evaluateFlag').mockResolvedValue({ variant: 'test-variant', value: 'test-value' })

    const result = await provider.resolveStringEvaluation('test-flag', 'default', { userId: 'user-123' })

    expect(mockEvaluateFlag).toHaveBeenCalledWith('test-flag', { userId: 'user-123' })
    expect(result).toEqual({
      value: 'test-value',
      variant: 'test-variant',
    })
  })

  it('should resolve number evaluations', async () => {
    const mockEvaluateFlag = vi.spyOn(provider, 'evaluateFlag').mockResolvedValue({ variant: 'test-variant', value: 42 })

    const result = await provider.resolveNumberEvaluation('test-flag', 0, { userId: 'user-123' })

    expect(mockEvaluateFlag).toHaveBeenCalledWith('test-flag', { userId: 'user-123' })
    expect(result).toEqual({
      value: 42,
      variant: 'test-variant',
    })
  })

  it('should resolve object evaluations', async () => {
    const mockEvaluateFlag = vi.spyOn(provider, 'evaluateFlag').mockResolvedValue({ variant: 'test-variant', value: { color: 'blue' } })

    const result = await provider.resolveObjectEvaluation('test-flag', {}, { userId: 'user-123' })

    expect(mockEvaluateFlag).toHaveBeenCalledWith('test-flag', { userId: 'user-123' })
    expect(result).toEqual({
      value: { color: 'blue' },
      variant: 'test-variant',
    })
  })

  it('should handle errors in evaluations', async () => {
    const mockEvaluateFlag = vi.spyOn(provider, 'evaluateFlag').mockRejectedValue(new Error('Test error'))

    const result = await provider.resolveBooleanEvaluation('test-flag', false, { userId: 'user-123' })

    expect(mockEvaluateFlag).toHaveBeenCalledWith('test-flag', { userId: 'user-123' })
    expect(result).toEqual({
      value: false,
      errorCode: 'ERROR',
      errorMessage: 'Test error',
    })
  })
})

describe('ExperimentsClient', () => {
  let client: ExperimentsClient

  beforeEach(() => {
    client = new ExperimentsClient({
      apiKey: 'test-api-key',
    })
  })

  it('should use OpenFeature provider for variant resolution', async () => {
    const mockResolveObjectEvaluation = vi.spyOn(VercelFlagsProvider.prototype, 'resolveObjectEvaluation').mockResolvedValue({
      value: { color: 'blue' },
      variant: 'test-variant',
    })

    const result = await client.getVariant('test-experiment', { userId: 'user-123' })

    expect(mockResolveObjectEvaluation).toHaveBeenCalledWith('test-experiment', {}, { userId: 'user-123' })

    expect(result).toEqual({
      id: 'test-variant',
      config: { color: 'blue' },
    })
  })

  it('should track metrics with the track method', async () => {
    const mockRecordMetric = vi.spyOn(VercelFlagsProvider.prototype, 'recordMetric').mockResolvedValue({})
    const mockCreate = vi.spyOn(client['api'], 'create').mockResolvedValue({})

    await client.track('test-experiment', 'test-variant', { click_through_rate: 1 }, { userId: 'user-123' })

    expect(mockRecordMetric).toHaveBeenCalledWith('test-experiment', 'test-variant', { click_through_rate: 1 })

    expect(mockCreate).toHaveBeenCalledWith('experiment-metrics', {
      experimentId: 'test-experiment',
      variantId: 'test-variant',
      metricName: 'click_through_rate',
      value: 1,
      userId: 'user-123',
      sessionId: undefined,
      metadata: { userId: 'user-123' },
    })
  })

  it('should track events with the trackEvent method', async () => {
    const mockCreate = vi.spyOn(client['api'], 'create').mockResolvedValue({})

    const originalWindow = global.window
    const mockVa = vi.fn()
    global.window = { va: mockVa } as any

    await client.trackEvent('test-experiment', 'test-variant', 'button_click', { buttonType: 'cta' }, { userId: 'user-123' })

    expect(mockVa).toHaveBeenCalledWith('event', {
      name: 'button_click',
      experimentName: 'test-experiment',
      variantId: 'test-variant',
      buttonType: 'cta',
    })

    expect(mockCreate).toHaveBeenCalledWith('experiment-metrics', {
      experimentId: 'test-experiment',
      variantId: 'test-variant',
      metricName: 'button_click',
      value: 1,
      userId: 'user-123',
      sessionId: undefined,
      metadata: {
        buttonType: 'cta',
        userId: 'user-123',
      },
    })

    global.window = originalWindow
  })

  it('should respect analyticsEnabled option', async () => {
    const clientWithoutAnalytics = new ExperimentsClient({
      apiKey: 'test-api-key',
      analyticsEnabled: false,
    })

    const mockCreate = vi.spyOn(clientWithoutAnalytics['api'], 'create').mockResolvedValue({})

    await clientWithoutAnalytics.trackEvent('test-experiment', 'test-variant', 'button_click')

    expect(mockCreate).not.toHaveBeenCalled()
  })
})
