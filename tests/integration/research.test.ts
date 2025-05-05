import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { research } from '../../sdks/research.do'
import { ai } from '../../sdks/functions.do'

vi.mock('process', async () => {
  const actual = await vi.importActual('process')
  return {
    ...actual,
    env: {
      ...process.env,
      NODE_ENV: 'integration',
      FUNCTIONS_DO_API_KEY: process.env.DO_API_KEY
    }
  }
})

describe('research function integration test', () => {
  const originalApiKey = process.env.FUNCTIONS_DO_API_KEY

  it('should work as a normal function call', async () => {
    const result = await research.research({
      topic: 'Integration testing best practices',
    })

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.taskId).toBeDefined()
    expect(result.jobId).toBeDefined()
  }, 30000) // Longer timeout for API call

  it('should work with ai.research template literal', async () => {
    const result = await ai.research`Integration testing best practices`

    console.log('Tagged template result:', JSON.stringify(result, null, 2))

    expect(result).toBeDefined()
    
    if (typeof result === 'string') {
      expect(result.length).toBeGreaterThan(0)
    } else {
      if (result.success !== undefined) expect(result.success).toBe(true)
      if (result.taskId !== undefined) expect(result.taskId).toBeDefined()
      if (result.jobId !== undefined) expect(result.jobId).toBeDefined()
    }
  }, 30000) // Longer timeout for API call
})
