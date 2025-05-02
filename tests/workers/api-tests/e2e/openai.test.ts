import fs from 'fs'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import { describe, expect, test } from 'vitest'

const models = ['openai/o4-mini', 'google/gemini-2.0-flash-001', 'anthropic/claude-3.7-sonnet']

// Explicitly call out llm.do and OpenRouter key usage
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  // baseURL: 'https://openrouter.ai/api/v1',
  baseURL: 'https://llm.do/api/v1',
  // baseURL: 'http://127.0.0.1:8787/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://workflows.do', // Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Site title for rankings on openrouter.ai.
  },
})

describe.skip('OpenAI SDK Responses', () => {
  test.each(models)('can create a response with %s', async (model) => {
    const response = await client.responses.create({ input: 'Hello, world!', model })
    expect(response).toBeDefined()
    expect(response.error).toBeNull()
    expect(response.id).toBeDefined()
    expect(response.output_text).toMatch(/hello|hi/i)
    console.log(`${model}: ${response.output_text}`)
  })

  // Currently fails due to OpenRouter not supporting PDFs
  test.fails.skip.each(models)(
    'can handle PDF input with %s',
    async (model) => {
      const input: ResponseInput = [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              filename: 'ORMwhitePaper.pdf',
              file_data: 'data:application/pdf;base64,' + fs.readFileSync(`${__dirname}/ORMwhitePaper.pdf`, 'base64'),
            },
            {
              type: 'input_text',
              text: 'What are the steps of CSDP?',
            },
          ],
        },
      ]

      const response = await client.responses.create({ model, input })
      console.log(`${model}: ${response.output_text}`)
      expect(response).toBeDefined()
      expect(response.error).toBeNull()
      expect(response.id).toBeDefined()
      expect(response.output_text).toContain('elementary fact')
    },
    60000,
  )
})

describe('OpenAI SDK Chat Completions', () => {
  test.each(models)('can create a chat completion with %s', async (model) => {
    const response = await client.chat.completions.create({ model, messages: [{ role: 'user', content: 'Hello, world!' }] })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.choices[0].message.content).toMatch(/hello|hi/i)
    console.log(`${model}: ${response.choices[0].message.content}`)
  })

  // Currently fails due to OpenRouter not supporting PDFs
  test.fails.skip.each(models)('can handle PDF input with %s', async (model) => {
    const response = await client.chat.completions.create({ model, messages: [{ role: 'user', content: 'Hello, world!' }] })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.choices[0].message.content).toContain('elementary fact')
    console.log(`${model}: ${JSON.stringify(response.choices[0].message.content)}`)
  })

  // test.each(models)('can use structured outputs using %s', async (model) => {
  //   const response = await client.chat.completions.create({
  //     model,
  //     messages: [{ role: 'user', content: 'Hello, world!' }],
  //     response_format: { type: 'json_schema', json_schema: { name: 'test', strict: true, schema: { type: 'object', properties: { test: { type: 'string' } } } } },
  //   })
  //   expect(response).toBeDefined()
  //   expect(response.id).toBeDefined()
  //   expect(response.choices[0].message.content).toContain('{')
  //   expect(response.choices[0].message.content).toMatch(/hello|hi/i)
  //   console.log(`${model}: ${JSON.stringify(response.choices[0].message.content)}`)
  // })
})

describe('OpenAI SDK Models', () => {
  test.skip.fails('can list models', async () => {
    const models = await client.models.list()
    expect(models).toBeDefined()
    expect(models.data.length).toBeGreaterThan(0)
  })
})
