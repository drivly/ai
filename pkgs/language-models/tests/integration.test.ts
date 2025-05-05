import { describe, it, expect } from 'vitest'
import { parse, getModel, getModels } from '../src/parser'
import { models } from '../src'

describe('integration tests', () => {
  it('should parse model references and find matching models', () => {
    const testCases = [
      'gemini',
      'anthropic/claude-3.7-sonnet',
      'r1'
    ]
    
    for (const testCase of testCases) {
      const parsed = parse(testCase)
      expect(parsed).toBeDefined()
      
      const matchingModel = models.find(model => {
        if (parsed.author && parsed.model) {
          return model.slug === `${parsed.author}/${parsed.model}`
        }
        return model.slug.endsWith(parsed.model || '')
      })
      
      expect(matchingModel).toBeDefined()
    }
  })
  
  it('should handle parsing models with capabilities', () => {
    const parsed = parse('gemini(reasoning,tools)')
    expect(parsed).toBeDefined()
    expect(parsed.model).toBe('gemini-2.0-flash-001')
    expect(parsed.capabilities).toHaveProperty('reasoning')
    expect(parsed.capabilities).toHaveProperty('tools')
  })
  
  it('should get models by alias', () => {
    const model = getModel('gemini')
    expect(model).toBeDefined()
    expect(model.slug).toBe('google/gemini-2.0-flash-001')
  })
  
  it('should get multiple models with getModels', () => {
    const models = getModels('gemini,r1')
    expect(models.length).toBe(2)
    expect(models[0].slug).toBe('google/gemini-2.0-flash-001')
    expect(models[1].slug).toBe('deepseek/deepseek-r1')
  })
  
  it('should parse model references with provider constraints', () => {
    const parsed = parse('gemini(cost<1)')
    expect(parsed).toBeDefined()
    expect(parsed.model).toBe('gemini-2.0-flash-001')
    expect(parsed.providerConstraints).toBeDefined()
    expect(parsed.providerConstraints?.length).toBeGreaterThan(0)
    expect(parsed.providerConstraints?.[0].field).toBe('cost')
    expect(parsed.providerConstraints?.[0].type).toBe('lt')
    expect(parsed.providerConstraints?.[0].value).toBe('1')
  })
})
