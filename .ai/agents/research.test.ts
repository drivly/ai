import 'dotenv/config'
import { describe, expect, it } from 'vitest'
import { research } from './research'

describe('research', () => {
  it('should return a string', async () => {
    const result = await research('Do Business-as-Code')
    console.log(result)
    expect(Array.isArray(result.citations)).toBe(true)
    expect(typeof result.markdown).toBe('string')
  }, 180000)

  it('should return a string', async () => {
    const company = 'Vercel'
    const result = await research(`the ICP for ${company}`)
    console.log(result)
    expect(Array.isArray(result.citations)).toBe(true)
    expect(typeof result.markdown).toBe('string')
  }, 180000)

  it('should return a string', async () => {
    const company = 'Cloudflare Workers'
    const result = await research(`the ICP for ${company}`)
    console.log(result)
    expect(Array.isArray(result.citations)).toBe(true)
    expect(typeof result.markdown).toBe('string')
  }, 180000)
})
