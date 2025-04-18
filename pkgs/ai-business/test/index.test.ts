import { describe, it, expect } from 'vitest'
import { createAiBusinessOperator, createBusinessIntegrations, AiBusinessOperator } from '../src'

describe('ai-business', () => {
  describe('createAiBusinessOperator', () => {
    it('should create an AiBusinessOperator instance', () => {
      const operator = createAiBusinessOperator()
      expect(operator).toBeInstanceOf(AiBusinessOperator)
    })

    it('should accept configuration options', () => {
      const operator = createAiBusinessOperator({
        defaultAnalysisFrequency: 'daily',
      })
      expect(operator).toBeInstanceOf(AiBusinessOperator)
    })
  })

  describe('createBusinessIntegrations', () => {
    it('should create a BusinessIntegrations instance', () => {
      const integrations = createBusinessIntegrations()
      expect(integrations).toBeDefined()
    })
  })
})
