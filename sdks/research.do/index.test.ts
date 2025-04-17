import { describe, it, expect } from 'vitest'
import { ResearchClient, research } from './index'

describe('research.do', () => {
  it('exports ResearchClient', () => {
    expect(ResearchClient).toBeDefined()
  })

  it('exports default client instance', () => {
    expect(research).toBeDefined()
    expect(research).toBeInstanceOf(ResearchClient)
  })
})
