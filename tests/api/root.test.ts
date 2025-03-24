import { describe, it, expect } from 'vitest'

describe('API Root', () => {
  it('should have IS_TEST_ENV set to true', () => {
    expect(process.env.IS_TEST_ENV).toBe('true')
  })

  it('should handle errors properly', () => {
    try {
      throw new Error('Test error')
    } catch (error) {
      // Proper type checking for errors
      if (error instanceof Error) {
        expect(error.message).toBe('Test error')
      } else {
        // Handle non-Error objects
        expect(String(error)).toContain('Test error')
      }
    }
  })
})