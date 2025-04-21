import { describe, it, expect } from 'vitest'
import { initAnalytics, trackMetric, defineExperiment } from '../src/index'

describe('Analytics SDK', () => {
  it('initializes with default config', () => {
    const analytics = initAnalytics()
    expect(analytics).toBeDefined()
    expect(analytics.track).toBeDefined()
    expect(analytics.trackPageView).toBeDefined()
  })

  it('tracks metrics', async () => {}, { skip: true })

  it('defines experiments', () => {
    const experiment = defineExperiment({
      name: 'test_experiment',
      description: 'A test experiment',
      variants: [
        { id: 'control', description: 'Control group' },
        { id: 'variant_a', description: 'Variant A' },
      ],
      metrics: {
        primary: 'conversion_rate',
        secondary: ['click_through_rate'],
      },
    })

    expect(experiment).toBeDefined()
    expect(experiment.id).toBe('test_experiment')
    expect(experiment.getVariant).toBeDefined()
    expect(experiment.trackMetric).toBeDefined()

    const userId1 = 'user1'
    const userId2 = 'user2'
    const variant1 = experiment.getVariant(userId1)
    const variant2 = experiment.getVariant(userId2)

    expect(experiment.getVariant(userId1)).toBe(variant1)
    expect(experiment.getVariant(userId2)).toBe(variant2)
  })
})
