import { describe, it, expect } from 'vitest'
import { CLI } from './index'

describe('CLI', () => {
  it('should export CLI class from apis.do', () => {
    expect(CLI).toBeDefined()
  })
})
