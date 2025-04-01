import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getModel, getModels } from '../src/modelSelector'

describe('selector', () => {
  it('should return a model', () => {
    const model = getModel('gemini')
    expect(model).toBeDefined()
  })

  it('should fail to find a model', () => {
    // Expect an error to be thrown
    expect(() => getModel('google/gemini-2.0-flash-001:reasoning')).toThrow()
  })

  it('should return a model with capabilities', () => {
    const model = getModel('anthropic/claude-3.7-sonnet')
    expect(model).toBeDefined()
  })

  it('should return the same model when seed is provided', () => {
    const models = Array(10)
      .fill(0)
      .map((_, i) => getModel('gemini(seed:123)'))

    // Ensure all models are the same
    expect(models.every((m) => m?.slug === models[0]?.slug)).toBe(true)
  })

  it('should return a Claude 3.7 Sonnet model with a custom slug', () => {
    const model = getModel('anthropic/claude-3.7-sonnet:thinking')
    expect(model).toBeDefined()
    expect(model?.slug).toBe('anthropic/claude-3.7-sonnet:thinking')
  })

  it('should return a Claude 3.7 Sonnet model with reasoning capabilities', () => {
    const model = getModel('anthropic/claude-3.7-sonnet:reasoning')
    expect(model).toBeDefined()
    expect(model?.slug).toBe('anthropic/claude-3.7-sonnet:thinking')
  })

  it('should return multiple models', () => {
    const models = getModels('anthropic/claude-3.7-sonnet:reasoning,r1')
    expect(models.length).toBe(2)
    expect(models[0]?.slug).toBe('anthropic/claude-3.7-sonnet:thinking')
    expect(models[1]?.slug).toBe('deepseek/deepseek-r1')
  })
})
