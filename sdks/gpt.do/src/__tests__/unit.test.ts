import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateText } from '../index'
import CLI from '../cli'

const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

describe('gpt.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    const mockResponse = {
      choices: [{ message: { content: 'Hello World' } }],
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response)
  })

  it('generateText should call the API and return text', async () => {
    const result = await generateText('Hello')

    expect(result.text).toBe('Hello World')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toContain('/llm/chat/completions')
  })

  it('CLI.generate should proxy to generateText', async () => {
    const cli = new CLI({ apiKey: 'test' })
    const res = await cli.generate('Hi')

    expect(res.text).toBe('Hello World')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

