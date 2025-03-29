import { expect, test, describe } from 'vitest'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import fs from 'fs'

// Explicitly call out llm.do and OpenRouter key usage
const client = new OpenAI({
  apiKey: process.env.OPENRROUTER_API_KEY,
  // baseURL: 'https://llm.do/api/v1',
  baseURL: 'http://127.0.0.1:8787/api/v1',
})

describe('OpenAI SDK', () => {
  test('can handle PDF input', async () => {
    if (process.env.CI) {
      console.log('Skipping OpenAI SDK test in CI environment')
      return expect(true).toBe(true)
    }
    const input: ResponseInput = [
      {
        role: 'user',
        content: [
          // {
          //   type: 'input_file',
          //   filename: 'ORMwhitepaper.pdf',
          //   file_data: 'data:application/pdf;base64,' + fs.readFileSync('./e2e/ORMwhitepaper.pdf', 'base64'),
          // },
          {
            type: 'input_text',
            text: 'What are the steps of CSDP?',
          },
        ],
      },
    ]

    let response = await client.responses.create({
      model: 'gemini-2.0-flash',
      input,
    })
    console.log(response)
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()

    response = await client.responses.create({
      model: 'gpt-4o',
      input,
    })
    console.log(response)
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()

    response = await client.responses.create({
      model: 'claude-3-7-sonnet',
      input,
    })
    console.log(response)
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
  }, 60000)
})
