import { describe, it, expect } from 'vitest'

describe('package exports', () => {
  it('should export parser module', async () => {
    const parser = await import('./parser.js')
    expect(parser.parse).toBeDefined()
    expect(parser.stringify).toBeDefined()
  })

  it('should export parser through main entry', async () => {
    const main = await import('./index.js')
    expect(main.parse).toBeDefined()
    expect(main.stringify).toBeDefined()
  })
})
