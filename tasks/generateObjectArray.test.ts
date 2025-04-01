import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateObjectArray } from './generateObjectArray'

global.fetch = vi.fn().mockResolvedValue({
  json: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: '[{"name":"Item 1","value":42},{"name":"Item 2","value":43}]',
          reasoning: 'Test reasoning for array'
        }
      }
    ]
  })
})

describe('generateObjectArray', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.AI_GATEWAY_URL = 'https://test-gateway.example.com'
    process.env.AI_GATEWAY_TOKEN = 'test-token'
  })

  it('should generate an array of objects', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      settings: { model: 'test-model' }
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() }
    })

    expect(result.objectArray).toEqual([
      { name: 'Item 1', value: 42 },
      { name: 'Item 2', value: 43 }
    ])
    expect(result.reasoning).toBe('Test reasoning for array')
  })

  it('should handle schema validation', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      settings: { model: 'test-model' }
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() }
    })

    expect(result.objectArray).toEqual([
      { name: 'Item 1', value: 42 },
      { name: 'Item 2', value: 43 }
    ])
    
    const fetchMock = global.fetch as any
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(requestBody.messages[0].content).toContain('schema')
  })

  it('should handle non-array responses', async () => {
    const fetchMock = global.fetch as any
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: '{"name":"Single Item","value":99}',
              reasoning: 'Test reasoning for single item'
            }
          }
        ]
      })
    })

    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      settings: { model: 'test-model' }
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() }
    })

    expect(result.objectArray).toEqual([
      { name: 'Single Item', value: 99 }
    ])
  })

  it('should handle JSON parsing errors', async () => {
    const fetchMock = global.fetch as any
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is not valid JSON',
              reasoning: 'Test reasoning'
            }
          }
        ]
      })
    })

    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      settings: { model: 'test-model' }
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() }
    })

    expect(result.objectArray).toEqual([
      { error: 'Failed to parse JSON array response' }
    ])
  })
})
