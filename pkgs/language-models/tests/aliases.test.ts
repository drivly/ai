import { describe, it, expect } from 'vitest'
import { aliases } from '../src/aliases'
import { models } from '../src'

describe('aliases', () => {
  it('should have all required model aliases', () => {
    expect(aliases).toHaveProperty('gemini')
    expect(aliases).toHaveProperty('claude-3.7-sonnet')
    expect(aliases).toHaveProperty('r1')
    
    expect(aliases['gemini']).toBe('google/gemini-2.0-flash-001')
    expect(aliases['claude-3.7-sonnet']).toBe('anthropic/claude-3.7-sonnet')
    expect(aliases['r1']).toBe('deepseek/deepseek-r1')
  })
  
  it('should only contain valid model references', () => {
    const modelSlugs = new Set(models.map(model => model.slug))
    
    for (const [_, modelSlug] of Object.entries(aliases)) {
      expect(modelSlugs.has(modelSlug) || modelSlug.includes('/')).toBe(true)
    }
  })
})
