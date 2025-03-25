import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateText } from '../../tasks/generateText'

// Mock fetch
global.fetch = vi.fn()

describe('generateText', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Mock successful response
    const mockResponse = {
      choices: [
        {
          message: {
            content: '# Hello World\n\nThis is a markdown response.',
            reasoning: 'This is a test reasoning',
          },
        },
      ],
    }

    // @ts-ignore - mocking fetch
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    })
  })

  it('should generate text with markdown formatting', async () => {
    // Setup
    const input = {
      functionName: 'testFunction',
      args: { test: 'value' },
      settings: { type: 'Text' },
    }

    // Execute
    const result = await generateText({ input, req: {} })

    // Verify
    expect(result.text).toBe('# Hello World\n\nThis is a markdown response.')
    expect(result.reasoning).toBe('This is a test reasoning')

    // Verify request was made with correct system prompt
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const fetchCall = global.fetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1].body)

    expect(requestBody.messages[0].role).toBe('system')
    expect(requestBody.messages[0].content).toBe('Respond in markdown format.')
  })

  it('should use custom settings when provided', async () => {
    // Setup
    const input = {
      functionName: 'testFunction',
      args: { test: 'value' },
      settings: {
        type: 'Text',
        model: 'custom-model',
        temperature: 0.7,
      },
    }

    // Execute
    const result = await generateText({ input, req: {} })

    // Verify request was made with custom settings
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const fetchCall = global.fetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1].body)

    expect(requestBody.model).toBe('custom-model')
    expect(requestBody.temperature).toBe(0.7)
  })
})
