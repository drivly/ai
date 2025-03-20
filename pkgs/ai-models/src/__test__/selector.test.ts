import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getModel } from '../modelSelector'

describe('selector', () => {
  it('should return a model', () => {
    const model = getModel('google/google/gemini-2.0-flash-001')
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
    const model = getModel([
      'google/google/gemini-2.0-flash-001:reasoning',
      'anthropic/claude-3-7-sonnet-20250219:reasoning'
    ])

    expect(model).toBeDefined()
    expect(model.modelId).toBe('claude-3-7-sonnet-20250219')
  })
})
