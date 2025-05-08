import { describe, it, expect } from 'vitest'
import { getProviderName } from '../src/providers'
import fs from 'fs'
import path from 'path'
import camelCase from 'camelcase'

describe('providers array', () => {
  it('should have over 400 items in providers.ts', () => {
    const providersPath = path.resolve(__dirname, '../src/providers.ts')
    const providersContent = fs.readFileSync(providersPath, 'utf-8')
    
    const providerLines = providersContent.match(/'[^']+',?/g) || []
    expect(providerLines.length).toBeGreaterThan(400)
  })
  
  it('should return provider names correctly', () => {
    expect(getProviderName('google')).toBe('Google AI Studio')
    expect(getProviderName('vertex')).toBe('Google')
    expect(getProviderName('openai')).toBeDefined()
    expect(getProviderName('anthropic')).toBeDefined()
  })
  
  it('should handle camelCased provider names', () => {
    const testProviders = [
      'Google AI Studio',
      'Amazon Bedrock',
      'Weights & Biases',
      'Hugging Face'
    ]
    
    for (const provider of testProviders) {
      const camelCasedName = camelCase(provider)
      const result = getProviderName(camelCasedName)
      expect(result).toBeDefined()
    }
  })
})
