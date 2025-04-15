import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { parse } from '../src/parser'

describe('parser', () => {
  it('should parse a model', () => {
    const model = parse('gemini')
    expect(model.author).toBe('google')
    expect(model.model).toBe('gemini-2.0-flash-001')
    expect(model.capabilities || []).toEqual([])
  })
})
