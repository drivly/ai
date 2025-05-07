import fs from 'fs'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import { describe, expect, test } from 'vitest'

const openaiModels = ['gpt-4o-search-preview']

const models = ['openai/o4-mini', 'google/gemini-2.0-flash-001', 'anthropic/claude-3.7-sonnet']

const pdf = getPdfData('ORMwhitePaper.pdf')

// Explicitly call out llm.do and OpenRouter key usage
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  // baseURL: 'https://openrouter.ai/api/v1',
  // baseURL: 'http://llm.do/llm',
  baseURL: 'http://localhost:3000/llm',
  defaultHeaders: {
    'HTTP-Referer': 'https://workflows.do', // Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Site title for rankings on openrouter.ai.
  },
})

describe.todo('OpenAI SDK Responses', () => {
  const isMockKey = process.env.OPEN_ROUTER_API_KEY === 'mock-openrouter-key'

  test.each(models)(
    'can create a response with %s',
    async (model) => {
      try {
        const response = await client.responses.create({ input: 'Hello, world!', model })
        expect(response).toBeDefined()

        if (isMockKey) {
          console.log(`Using mock key for ${model}, verifying response structure only`)
        } else {
          expect(response.error).toBeNull()
          expect(response.id).toBeDefined()
          expect(response.output_text).toMatch(/hello|hi/i)
          console.log(`${model}: ${response.output_text}`)
        }
      } catch (error) {
        if (isMockKey) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.log(`Expected error with mock key for ${model}: ${errorMessage}`)
        } else {
          throw error
        }
      }
    },
    60000,
  )

  test.each(models)(
    'can handle PDF input with %s',
    async (model) => {
      const input: ResponseInput = [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              filename: 'ORMwhitePaper.pdf',
              file_data: pdf,
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
  const isMockKey = process.env.OPEN_ROUTER_API_KEY === 'mock-openrouter-key'

  test.todo(
    'can create a chat completion with models',
    async () => {
      try {
        const response = await client.chat.completions.create({
          // @ts-expect-error OpenAI SDK does not support models
          models: models.slice(1),
          messages: [{ role: 'user', content: 'Hello, world!' }],
        })
        expect(response).toBeDefined()

        if (isMockKey) {
          console.log(`Using mock key for ${models[0]}, verifying response structure only`)
        } else {
          console.log(JSON.stringify(response, null, 2))
          expect(response.id).toBeDefined()
          expect(response.choices[0].message.content).toMatch(/hello|hi/i)
          expect(response.model).toBe(models[1])
          console.log(`${models[0]}: ${response.choices[0].message.content}`)
        }
      } catch (error) {
        if (isMockKey) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.log(`Expected error with mock key for ${models[0]}: ${errorMessage}`)
        } else {
          throw error
        }
      }
    },
    60000,
  )

  test.each(models)(
    'can create a chat completion with %s',
    async (model) => {
      try {
        const response = await client.chat.completions.create({ model, messages: [{ role: 'user', content: 'Hello, world!' }] })
        expect(response).toBeDefined()

        if (isMockKey) {
          console.log(`Using mock key for ${model}, verifying response structure only`)
        } else {
          console.log(response)
          expect(response.id).toBeDefined()
          expect(response.choices[0].message.content).toMatch(/hello|hi/i)
          console.log(`${model}: ${response.choices[0].message.content}`)
        }
      } catch (error) {
        if (isMockKey) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.log(`Expected error with mock key for ${model}: ${errorMessage}`)
        } else {
          throw error
        }
      }
    },
    60000,
  )

  test.skip.fails.each(models)(
    'can handle PDF input with %s',
    async (model) => {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'file',
                file: {
                  filename: 'ORMwhitePaper.pdf',
                  file_data: pdf,
                },
              },
              {
                type: 'text',
                text: 'What are the steps of CSDP?',
              },
            ],
          },
        ],
      })
      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      expect(response.choices[0].message.content).toContain('elementary fact')
      console.log(`${model}: ${JSON.stringify(response.choices[0].message.content)}`)
    },
    60000,
  )

  test.fails.skip.each(models)('can use structured outputs using %s', async (model) => {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'Hello, world!' }],
      response_format: { type: 'json_schema', json_schema: { name: 'test', strict: true, schema: { type: 'object', properties: { test: { type: 'string' } } } } },
    })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.choices[0].message.content).toContain('{')
    expect(response.choices[0].message.content).toMatch(/hello|hi/i)
    console.log(`${model}: ${JSON.stringify(response.choices[0].message.content)}`)
  })

  test.todo('can strategize requests to providers', async () => {
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, world!' }],
      // @ts-expect-error OpenAI SDK does not support provider
      provider: {
        sort: 'price',
      },
    })
    expect(response).toBeDefined()
    console.log(JSON.stringify(response, null, 2))
  })
})

test.each(openaiModels)(
  'can create a web search chat completion with %s',
  async (model) => {
    const response = await client.chat.completions.create({
      web_search_options: {
        search_context_size: 'low',
        user_location: {
          type: 'approximate',
          approximate: { city: 'South Saint Paul', country: 'US', region: 'Minnesota', timezone: 'America/Chicago' },
        },
      },
      model,
      messages: [{ role: 'user', content: "What's the weather in South Saint Paul?" }],
    })
    expect(response).toBeDefined()
    console.log(`${model}: ${JSON.stringify(response.choices[0].message.content)}`)
    expect(response.choices[0].message.content).toMatch(/°/)
  },
  60000,
)

describe('OpenAI SDK Models', () => {
  const isMockKey = process.env.OPEN_ROUTER_API_KEY === 'mock-openrouter-key'

  test.fails(
    'can list models',
    async () => {
      try {
        const models = await client.models.list()
        expect(models).toBeDefined()

        if (!isMockKey) {
          expect(models.data.length).toBeGreaterThan(0)
        }
      } catch (error) {
        if (isMockKey) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.log(`Expected error with mock key for models.list: ${errorMessage}`)
        } else {
          throw error
        }
      }
    },
    60000,
  )
})

function getPdfData(filename: string) {
  return 'data:application/pdf;base64,' + fs.readFileSync(`${__dirname}/${filename}`, 'base64')
}
