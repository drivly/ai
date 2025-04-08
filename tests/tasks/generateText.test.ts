import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { generateText } from '@/tasks/ai/generateText'

// Setup mock fetch with proper type
const mockFetch: Mock = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

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

    // Mock fetch response
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as Response)
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
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Extract request data directly from the mock call arguments
    const url = mockFetch.mock.calls[0][0]
    const options = mockFetch.mock.calls[0][1]
    const requestBody = JSON.parse(options.body)

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
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Extract request data directly from the mock call arguments
    const options = mockFetch.mock.calls[0][1]
    const requestBody = JSON.parse(options.body)

    expect(requestBody.model).toBe('custom-model')
    expect(requestBody.temperature).toBe(0.7)
  })
})
