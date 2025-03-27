import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { parse } from '../src/parser'

describe('parser', () => {
  it('should parse a model', () => {
    const model = parse('google/google/gemini-2.0-flash-001')

    expect(model.provider).toBe('google')
    expect(model.author).toBe('google')
    expect(model.model).toBe('gemini-2.0-flash-001')
    expect(model.capabilities).toEqual([])
  })

  it('should parse a model with capabilities', () => {
    const model = parse('google/google/gemini-2.0-flash-001:reasoning')

    expect(model.provider).toBe('google')
    expect(model.author).toBe('google')
    expect(model.model).toBe('gemini-2.0-flash-001')
    expect(model.capabilities).toEqual(['reasoning'])
  })

  it('should parse a model with system config', () => {
    const model = parse('gpt-4o:reasoning(seed:123,temperature:0.5,maxTokens:1000,topP:1)')
    expect(model.model).toBe('gpt-4o')
    expect(model.capabilities).toEqual(['reasoning'])
    expect(model.systemConfig).toEqual({ seed: 123, temperature: 0.5, maxTokens: 1000, topP: 1 })
  })

  it('should parse a model with system config and capabilities', () => {
    const model = parse('gpt-4o:reasoning(seed:123,temperature:0.5,maxTokens:1000,topP:1)')
    expect(model.model).toBe('gpt-4o')
    expect(model.capabilities).toEqual(['reasoning'])
    expect(model.systemConfig).toEqual({ seed: 123, temperature: 0.5, maxTokens: 1000, topP: 1 })
  })

  it('should parse a claude model successfully', () => {
    const model = parse('anthropic/claude-3.7-sonnet:thinking')
    expect(model.model).toBe('claude-3.7-sonnet:thinking')
    expect(model.capabilities).toEqual(['reasoning'])
  })
})
