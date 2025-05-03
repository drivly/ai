import 'dotenv/config'
import { describe, expect, it } from 'vitest'
import { research } from './research'

describe('research', () => {
  it('should return markdown and citations array', async () => {
    const result = await research('Do Business-as-Code')
    console.log(result)
    expect(Array.isArray(result.citations)).toBe(true)
    expect(typeof result.markdown).toBe('string')
  }, 180000)

  it('should append references section when citations exist', async () => {
    const company = 'Vercel'
    const result = await research(`the ICP for ${company}`)
    console.log(result)
    expect(Array.isArray(result.citations)).toBe(true)
    expect(typeof result.markdown).toBe('string')
    
    if (result.citations.length > 0) {
      expect(result.markdown).toContain('## References')
      
      const firstCitation = result.citations[0]
      expect(result.markdown).toContain(`1. ${firstCitation}`)
    }
  }, 180000)

  it('should handle empty citations gracefully', async () => {
    const company = 'Cloudflare Workers'
    const result = await research(`the ICP for ${company}`)
    console.log(result)
    expect(Array.isArray(result.citations)).toBe(true)
    expect(typeof result.markdown).toBe('string')
    
    if (result.citations.length === 0) {
      expect(result.markdown).not.toContain('## References')
    }
  }, 180000)
})
