// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateMarkdown } from './generateMarkdown'
import { generateText } from './generateText'

// Mock the generateText function
vi.mock('./generateText', () => ({
  generateText: vi.fn(),
}))

describe('generateMarkdown', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should generate markdown and return both markdown text and MDAST', async () => {
    // Mock the generateText response
    const mockMarkdown = '# Hello World\n\nThis is a test markdown.'
    const mockTextResult = {
      text: mockMarkdown,
      reasoning: 'Some reasoning',
      generation: { choices: [{ message: { content: mockMarkdown } }] },
      generationLatency: 100,
      request: { model: 'test-model' },
    }

    // Setup the mock to return our test data
    vi.mocked(generateText).mockResolvedValue(mockTextResult)

    // Call the function
    const result = await generateMarkdown({
      input: {
        functionName: 'testFunction',
        args: { test: 'value' },
      },
      req: {},
    })

    // Verify the function was called with the right parameters
    expect(generateText).toHaveBeenCalledWith({
      input: {
        functionName: 'testFunction',
        args: { test: 'value' },
      },
      req: {},
    })

    // Verify the result contains both markdown and mdast
    expect(result).toHaveProperty('markdown')
    expect(result).toHaveProperty('mdast')
    expect(result.markdown).toBe(mockMarkdown)

    // Verify the MDAST structure (basic validation)
    expect(result.mdast).toHaveProperty('type', 'root')
    expect(result.mdast).toHaveProperty('children')
    expect(Array.isArray(result.mdast.children)).toBe(true)

    // Verify other properties are passed through
    expect(result.reasoning).toBe(mockTextResult.reasoning)
    expect(result.generation).toEqual(mockTextResult.generation)
    expect(result.generationLatency).toBe(mockTextResult.generationLatency)
    expect(result.request).toEqual(mockTextResult.request)
  })
})
