import { describe, it, expect } from 'vitest'
import { ai } from './load.js'

describe('ai', () => {
  it('should load ai', () => {
    console.log(ai)
    expect(ai).toHaveProperty('posts.hello-world')
  })
})
