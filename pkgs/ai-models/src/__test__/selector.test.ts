import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getModel } from '../modelSelector'

describe('selector', () => {
  it('should return a model', () => {
    const model = getModel('drivly/frontier:reasoning')
    expect(model).toBeDefined()
  })

  it('should fail to find a model', () => {
    // Expect an error to be thrown
    expect(() => getModel('google/google/gemini-2.0-flash-001:reasoning')).toThrow()
  })

  it('should return a model with capabilities', () => {
    const model = getModel('claude-3-7-sonnet-20250219:reasoning')
    expect(model).toBeDefined()
  })

  it('should fallback to another model that supports the capabilities', () => {
    const model = getModel(['google/google/gemini-2.0-flash-001:reasoning', 'anthropic/claude-3-7-sonnet-20250219:reasoning'])

    expect(model).toBeDefined()
  })

  it('should return the same model when seed is provided', () => {
    const models = Array(10)
      .fill(0)
      .map((_, i) => getModel('drivly/frontier(seed:123)'))

    // Ensure all models are the same
    expect(models.every((m) => m?.slug === models[0]?.slug)).toBe(true)
  })
})
