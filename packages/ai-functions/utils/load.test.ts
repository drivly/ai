import { describe, it, expect } from 'vitest'
import { ai } from './load.js'

describe('ai', () => {
  it('should load AI functions from mdx', () => {
    console.log(ai)
    expect(ai).toHaveProperty('hello')
  })

  it('should generate text if output is a string', async () => {
    const result = await ai.hello({ name: 'World' })
    console.log(result)
    expect(result.length).toBeGreaterThan(20)
  })
}, 15000)
