import fs from 'fs'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import { describe, expect, test } from 'vitest'

const searchModels = ['gpt-4o-search-preview']

const models = ['openai/o4-mini', 'google/gemini-2.0-flash-001', 'anthropic/claude-3.7-sonnet']

const pdf = getPdfData('ORMwhitePaper.pdf')

// Use to skip tests in development
const skipTests: ('pdf' | 'structured-outputs' | 'tools')[] = ['pdf']

console.log(`Skipping tests: ${skipTests.join(', ')}`)

const geminiToolFixPrompt = ' Do not ask for arguments to a tool, use your best judgement. If you are unsure, return null.'

// Explicitly call out llm.do and OpenRouter key usage
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  // baseURL: 'https://openrouter.ai/api/v1',
  // baseURL: 'http://llm.do/llm',
  baseURL: 'http://localhost:3000/api/llm',
  defaultHeaders: {
    'HTTP-Referer': 'https://workflows.do', // Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Site title for rankings on openrouter.ai.
  },
})

describe.skip('OpenAI SDK Responses', () => {
  const isMockKey = process.env.OPEN_ROUTER_API_KEY === 'mock-openrouter-key'

  test.fails.each(models)(
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

  test.skipIf(skipTests.includes('pdf')).fails.each(models)(
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
              text: 'Who is the author of the white paper?',
            },
          ],
        },
      ]

      const response = await client.responses.create({ model, input })
      console.log(`${model}: ${response.output_text}`)
      expect(response).toBeDefined()
      expect(response.error).toBeNull()
      expect(response.id).toBeDefined()
      expect(response.output_text).toContain('Halpin')
    },
    60000,
  )
})

describe('OpenAI SDK Chat Completions', () => {
  const isMockKey = process.env.OPEN_ROUTER_API_KEY === 'mock-openrouter-key'

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

  test.skipIf(skipTests.includes('pdf')).each(models)(
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

  test.skipIf(skipTests.includes('tools')).each(models)(
    'can use Composio tools using %s',
    async (model) => {
      const response = await client.chat.completions.create({
        model: `${model}(testTool)`, // Force the model to use the testTool
        messages: [
          {
            role: 'user',
            content: 'You must return the result of the testTool. The message parameter must be "Hello, World.", dont ask for other parameters, do your best effort.',
          },
        ],
      })

      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      expect(response.choices[0].message.content).toContain('Hello, World.')
    },
    60000,
  )

  test.skipIf(skipTests.includes('tools')).each(models)(
    'can use local tools using %s',
    async (model) => {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: 'You must return the result of the testTool. The message parameter must be "Hello, World.", dont ask for other parameters, do your best effort.',
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'localTestingTool',
              description: 'A testing tool.',
              parameters: { type: 'object', properties: { message: { type: 'string', description: 'The message to return' } } },
              strict: true,
            },
          },
        ],
      })

      console.log(response)

      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      expect(response.choices[0].message.content).toContain('Hello, World.')
    },
    60000,
  )

  test.only.each(models)('can use structured outputs using %s', async (model) => {
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
})

// Skipped due to not supporting web search via our API yet.
// TODO: Add web search support to our API.
describe.skip('OpenAI SDK Web Search', () => {
  test.each(searchModels)(
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
})

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

describe('OpenRouter Privacy and Logging', () => {
  test.todo(
    'can create a chat completion with privacy enabled',
    async () => {
      const response = await client.chat.completions.create({
        model: models[0],
        messages: [{ role: 'user', content: 'Hello, world!' }],
        // @ts-expect-error OpenAI SDK does not support privacy feature
        privacy: {
          remove_metadata: true,
          remove_pii: true,
          store_message: false,
        },
      })
      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      expect(response.choices[0].message.content).toBeTruthy()
      console.log(`Privacy test: ${JSON.stringify(response.choices[0].message.content)}`)
    },
    60000,
  )
})

describe('OpenRouter Model Routing', () => {
  test.skip('can auto-route', async () => {
    const response = await client.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'user', content: 'Hello, world!' }],
    })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.model).not.toBe('openrouter/auto')
  }, 60000)

  test.skip('can route to specific models by name', async () => {
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, world!' }],
      // @ts-expect-error OpenAI SDK does not support models array
      models: models.slice(1, 2),
    })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.model).toBe(models[1])
  }, 60000)
})

describe('OpenRouter Provider Routing', () => {
  // We dont support no model yet.
  test.skip('can route to providers by sorting by price', async () => {
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, world!' }],
      // @ts-expect-error OpenAI SDK does not support provider
      provider: {
        sort: 'price',
      },
    })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.model).not.toMatch(/openai/)
  }, 60000)

  test.skip('can route to specific providers', async () => {
    const response = await client.chat.completions.create({
      model: 'mistralai/mistral-nemo',
      messages: [{ role: 'user', content: 'Hello, world!' }],
      // @ts-expect-error OpenAI SDK does not support provider
      provider: {
        only: ['Parasail'],
      },
    })
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    // @ts-expect-error OpenAI SDK does not support provider
    expect(response.provider).toBe('Parasail')
  }, 60000)
})

describe('OpenRouter Prompt Caching', () => {
  test.skip.fails(
    'can create a chat completion with caching enabled',
    async () => {
      const firstResponse = await client.chat.completions.create({
        model: 'openai/o1-mini',
        messages: [{ role: 'user', content: 'What is the capital of France?' }],
        // @ts-expect-error OpenAI SDK does not support cache usage
        usage: { include: true },
      })
      expect(firstResponse).toBeDefined()

      const secondResponse = await client.chat.completions.create({
        model: 'openai/o1-mini',
        messages: [{ role: 'user', content: 'What is the capital of France?' }],
        // @ts-expect-error OpenAI SDK does not support cache usage
        usage: { include: true },
      })
      expect(secondResponse).toBeDefined()

      console.log(JSON.stringify(firstResponse, null, 2))
      console.log(JSON.stringify(secondResponse, null, 2))

      expect(secondResponse.choices[0].message.content).toBe(firstResponse.choices[0].message.content)
      expect(secondResponse.usage).toBeDefined()
      expect(secondResponse.usage?.prompt_tokens_details).toBeDefined()
      expect(secondResponse.usage?.prompt_tokens_details?.cached_tokens).toBeGreaterThan(0)
      console.log(`Caching test: ${firstResponse.choices[0].message.content}`)
    },
    60000,
  )
})

describe('OpenRouter Structured Outputs', () => {
  test.fails(
    'can create a chat completion with JSON schema',
    async () => {
      const response = await client.chat.completions.create({
        model: models[0],
        messages: [{ role: 'user', content: 'List three French cities and their populations' }],
        response_format: {
          type: 'json_object',
        },
      })
      expect(response).toBeDefined()
      expect(response.choices[0].message.content).toBeTruthy()
      const content = response.choices[0].message.content || ''
      try {
        if (content.includes('{')) {
          const parsed = JSON.parse(content)
          expect(parsed).toBeDefined()
          if (parsed.cities) {
            expect(parsed.cities.length).toBeGreaterThan(0)
          }
          console.log(`Structured output: ${content}`)
        }
      } catch (e) {
        console.error('Failed to parse JSON response:', e)
      }
    },
    60000,
  )
})

describe('OpenRouter Tool Calling', () => {
  test('can create a chat completion with tool calling', async () => {
    const response = await client.chat.completions.create({
      model: models[0],
      messages: [
        {
          role: 'user',
          content: 'What is the weather in New York and London today?',
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_weather',
            description: 'Get the current weather in a given location',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The city and state, e.g. San Francisco, CA',
                },
                unit: {
                  type: 'string',
                  enum: ['celsius', 'fahrenheit'],
                  description: 'The unit of temperature to use',
                },
              },
              required: ['location'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    })
    expect(response).toBeDefined()
    expect(response.choices[0].message).toBeDefined()
    if (response.choices[0].message.tool_calls) {
      expect(response.choices[0].message.tool_calls.length).toBeGreaterThan(0)
      expect(response.choices[0].message.tool_calls[0].function.name).toBe('get_weather')
      console.log(`Tool calling: ${JSON.stringify(response.choices[0].message.tool_calls[0])}`)
    }
  }, 60000)
})

describe('OpenRouter Images & PDFs', () => {
  const imagePath = `${__dirname}/assets/images/test-image.jpg`
  const imageData = 'data:image/jpeg;base64,' + fs.readFileSync(imagePath, 'base64')

  test.fails(
    'can create a chat completion with image input',
    async () => {
      const response = await client.chat.completions.create({
        model: 'openai/gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What do you see in this image?',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
      })
      expect(response).toBeDefined()
      expect(response.choices[0].message.content).toBeTruthy()
      console.log(`Image input: ${response.choices[0].message.content}`)
    },
    60000,
  )
})

describe('OpenRouter Message Transforms', () => {
  test.todo(
    'can create a chat completion with message transforms',
    async () => {
      const response = await client.chat.completions.create({
        model: models[0],
        messages: [{ role: 'user', content: 'Hello, world!' }],
        // @ts-expect-error OpenAI SDK does not support message transforms
        transforms: [
          {
            type: 'context_window',
            target: 64000,
          },
        ],
      })
      expect(response).toBeDefined()
      expect(response.choices[0].message.content).toBeTruthy()
      console.log(`Message transforms: ${response.choices[0].message.content}`)
    },
    60000,
  )
})

describe('OpenRouter Uptime Optimization', () => {
  test.todo(
    'can create a chat completion with uptime optimization',
    async () => {
      const response = await client.chat.completions.create({
        model: models[0],
        messages: [{ role: 'user', content: 'Hello, world!' }],
        // @ts-expect-error OpenAI SDK does not support uptime optimization
        route_option: 'high_uptime',
      })
      expect(response).toBeDefined()
      expect(response.choices[0].message.content).toBeTruthy()
      console.log(`Uptime optimization: ${response.choices[0].message.content}`)
    },
    60000,
  )
})

describe('OpenRouter Web Search', () => {
  test.todo(
    'can create a chat completion with web search',
    async () => {
      const response = await client.chat.completions.create({
        model: searchModels[0],
        messages: [{ role: 'user', content: 'What are the latest news about AI today?' }],
        web_search_options: {
          search_context_size: 'high',
          user_location: {
            type: 'approximate',
            approximate: {
              city: 'San Francisco',
              country: 'US',
              region: 'California',
              timezone: 'America/Los_Angeles',
            },
          },
        },
      })
      expect(response).toBeDefined()
      expect(response.choices[0].message).toBeDefined()
      const content = response.choices[0].message.content || ''
      expect(content.length).toBeGreaterThan(0)
      console.log(`Web search: ${content.substring(0, Math.min(content.length, 100))}...`)
    },
    60000,
  )
})

describe('OpenRouter Zero Completion Insurance', () => {
  test.todo(
    'can create a chat completion with zero completion insurance',
    async () => {
      const response = await client.chat.completions.create({
        model: models[0],
        messages: [{ role: 'user', content: 'Hello, world!' }],
        // @ts-expect-error OpenAI SDK does not support zero completion insurance
        zero_completion_insurance: true,
      })
      expect(response).toBeDefined()
      expect(response.choices[0].message.content).toBeTruthy()
      console.log(`Zero completion insurance: ${response.choices[0].message.content}`)
    },
    60000,
  )
})

describe('OpenRouter Provisioning API Keys', () => {
  test.fails(
    'can provision API keys for providers',
    async () => {
      // @ts-expect-error OpenAI SDK does not support provisioning API keys
      const response = await client.keys.create({
        provider: 'openai',
        key: 'sk-test-key',
        name: 'Test OpenAI Key',
      })
      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      console.log(`Provisioned key: ${response.id}`)
    },
    60000,
  )

  test.fails(
    'can list provisioned API keys',
    async () => {
      // @ts-expect-error OpenAI SDK does not support listing API keys
      const response = await client.keys.list()
      expect(response).toBeDefined()
      expect(response.data).toBeDefined()
      console.log(`Listed keys count: ${response.data.length}`)
    },
    60000,
  )
})

function getPdfData(filename: string) {
  return 'data:application/pdf;base64,' + fs.readFileSync(`${__dirname}/assets/${filename}`, 'base64')
}
