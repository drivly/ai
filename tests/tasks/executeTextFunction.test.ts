import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateText } from '../../tasks/generateText'
import { executeFunction } from '../../tasks/executeFunction'

// Mock the dependencies
vi.mock('../../tasks/generateText')
vi.mock('@vercel/functions', () => ({
  waitUntil: vi.fn((promise) => promise),
}))

// Mock payload
const mockPayload = {
  find: vi.fn(),
  create: vi.fn(),
}

describe('executeFunction with text output', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock the generateText implementation
    const mockGenerateText = generateText as any
    mockGenerateText.mockResolvedValue({
      text: '# Test Markdown\nThis is a test markdown response.',
      reasoning: 'Generated markdown for testing',
      generation: { choices: [{ message: { content: '# Test Markdown\nThis is a test markdown response.' } }] },
      generationLatency: 100,
      request: { model: 'test-model' },
    })

    // Mock payload.find to return empty results
    mockPayload.find.mockResolvedValue({ docs: [] })

    // Mock payload.create to return created documents
    mockPayload.create.mockImplementation((data) => {
      return Promise.resolve({ id: 'mock-id', ...data.data })
    })
  })

  it('should handle text function types correctly', async () => {
    // Test input with Markdown type
    const input = {
      functionName: 'generateMarkdown',
      args: { topic: 'Testing' },
      type: 'Markdown',
    }

    const req = { headers: new Map() }

    // Execute the function
    const result = await executeFunction({ input, req, payload: mockPayload })

    // Verify generateText was called
    expect(generateText).toHaveBeenCalledWith({
      input: expect.objectContaining({
        functionName: 'generateMarkdown',
        args: { topic: 'Testing' },
      }),
      req,
    })

    // Verify the result structure
    expect(result).toEqual({
      output: { text: '# Test Markdown\nThis is a test markdown response.' },
      reasoning: 'Generated markdown for testing',
    })

    // Verify function was created with correct type
    expect(mockPayload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'functions',
        data: expect.objectContaining({
          name: 'generateMarkdown',
          type: 'Markdown',
        }),
      }),
    )
  })
})
