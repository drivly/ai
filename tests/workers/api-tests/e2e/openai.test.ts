import fs from 'fs'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import { describe, expect, test } from 'vitest'

// Explicitly call out llm.do and OpenRouter key usage
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://llm.do/api/v1',
  // baseURL: 'http://127.0.0.1:8787/api/v1',
})

describe('OpenAI SDK', () => {
  test.each(['gpt-4o', 'gemini-2.0-flash-001', 'claude-3.7-sonnet'])('can create a response with %s', async (model) => {
    const response = await client.responses.create({ input: 'Hello, world!', model })
    expect(response).toBeDefined()
    expect(response.error).toBeNull()
    expect(response.id).toBeDefined()
    expect(response.output_text).toMatch(/hello|hi/i)
  })

  // This endpoint's maximum context length is 128000 tokens. However, you requested about 137982 tokens (137982 of text input). Please reduce the length of either one, or use the "middle-out" transform to compress your prompt automatically.

  test.fails.each(['gpt-4o', 'gemini-2.0-flash-001', 'claude-3.7-sonnet'])(
    'can handle PDF input with %s',
    async (model) => {
      const input: ResponseInput = [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              filename: 'ORMwhitepaper.pdf',
              file_data: 'data:application/pdf;base64,' + fs.readFileSync('./e2e/ORMwhitepaper.pdf', 'base64'),
            },
            {
              type: 'input_text',
              text: 'What are the steps of CSDP?',
            },
          ],
        },
      ]

      const response = await client.responses.create({ model, input })
      console.log(response)
      expect(response).toBeDefined()
      expect(response.error).toBeNull()
      expect(response.id).toBeDefined()
      expect(response.output_text).toContain('elementary fact')
    },
    60000,
  )
})
