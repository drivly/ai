import { expect, test, describe } from 'vitest'
import OpenAI from 'openai'

// Explicitly call out llm.do and OpenRouter key usage
const client = new OpenAI({
  apiKey: process.env.OPENRROUTER_API_KEY,
  baseURL: 'https://llm.do/api/v1',
  // baseURL: 'http://127.0.0.1:8787/api/v1',
})

describe('OpenAI SDK', () => {
  test('can create a response', async () => {
    const response = await client.responses.create({
      input: 'Hello, world!',
      model: 'gpt-4o',
    })
    console.log(response)
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
  })

  test.fails('can create an image', async () => {
    const response = await client.images.generate({
      prompt: 'A beautiful sunset over a calm ocean',
      n: 1,
      size: '1024x1024',
    })
    console.log(response)
    expect(response).toBeDefined()
    expect(response.data[0].url).toBeDefined()
  })
})
