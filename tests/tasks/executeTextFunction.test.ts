import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateText } from '../../tasks/generateText'
import { generateMarkdown } from '../../tasks/generateMarkdown'
import { executeFunction } from '../../tasks/executeFunction'

// Mock the dependencies
vi.mock('../../tasks/generateText')
vi.mock('../../tasks/generateMarkdown')
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

    const mockGenerateMarkdown = generateMarkdown as any
    mockGenerateMarkdown.mockResolvedValue({
      markdown: '# Test Markdown\nThis is a test markdown response.',
      reasoning: 'Generated markdown for testing',
      generation: { choices: [{ message: { content: '# Test Markdown\nThis is a test markdown response.' } }] },
      generationLatency: 100,
      request: { model: 'test-model' },
      mdast: {},
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

    expect(generateMarkdown).toHaveBeenCalledWith({
      input: expect.objectContaining({
        functionName: 'generateMarkdown',
        args: { topic: 'Testing' },
      }),
      req,
    })

    // Verify the result structure
    expect(result).toEqual({
      output: {
        text: '# Test Markdown\nThis is a test markdown response.',
        mdast: expect.any(Object), // Allow mdast property with any object structure
      },
      reasoning: 'Generated markdown for testing',
    })

    expect(mockPayload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'functions',
        data: expect.objectContaining({
          name: 'generateMarkdown',
          type: 'Generation',
          format: 'Markdown',
        }),
      }),
    )
  })

  it('should handle TextArray function types correctly', async () => {
    vi.clearAllMocks()

    const mockGenerateMarkdown = generateMarkdown as any
    mockGenerateMarkdown.mockResolvedValue({
      markdown: '1. First item\n2. Second item\n3. Third item',
      reasoning: 'Generated text array for testing',
      generation: { choices: [{ message: { content: '1. First item\n2. Second item\n3. Third item' } }] },
      generationLatency: 100,
      request: { model: 'test-model' },
      mdast: {},
    })

    const input = {
      functionName: 'generateList',
      args: { topic: 'Testing' },
      type: 'TextArray',
    }

    const req = { headers: new Map() }

    // Execute the function
    const result = await executeFunction({ input, req, payload: mockPayload })

    // Verify the result structure
    expect(result).toEqual({
      output: ['First item', 'Second item', 'Third item'],
      reasoning: 'Generated text array for testing',
    })

    expect(mockPayload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'functions',
        data: expect.objectContaining({
          name: 'generateList',
          type: 'Generation',
          format: 'TextArray',
        }),
      }),
    )
  })

  it('should handle Text function types correctly', async () => {
    vi.clearAllMocks()

    const mockGenerateText = generateText as any
    mockGenerateText.mockResolvedValue({
      text: 'This is a simple text response.',
      reasoning: 'Generated text for testing',
      generation: { choices: [{ message: { content: 'This is a simple text response.' } }] },
      generationLatency: 100,
      request: { model: 'test-model' },
    })

    const input = {
      functionName: 'generateText',
      args: { topic: 'Testing' },
      type: 'Text',
    }

    const req = { headers: new Map() }

    // Execute the function
    const result = await executeFunction({ input, req, payload: mockPayload })

    // Verify the result structure
    expect(result).toEqual({
      output: 'This is a simple text response.',
      reasoning: 'Generated text for testing',
    })

    expect(mockPayload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'functions',
        data: expect.objectContaining({
          name: 'generateText',
          type: 'Generation',
          format: 'Text',
        }),
      }),
    )
  })
})
