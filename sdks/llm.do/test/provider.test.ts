import { describe, it, expect } from 'vitest'
import { generateText, tool, embed, generateObject, stepCountIs } from 'ai'
import { createLLMProvider } from '../src'
import { getModel } from '@/pkgs/language-models'
import { z } from 'zod'

const llm = createLLMProvider({
  baseURL: `${process.env.NEXT_PREVIEW_URL ?? 'http://localhost:3000'}/api/llm`,
})

const geminiToolFixPrompt = ' Do not ask for arguments to a tool, use your best judgement. If you are unsure, return null.'

describe('llm.do Chat Completions 💭', () => {
  // Basic functionality tests
  it('should support basic text generation', async () => {
    const result = await generateText({
      model: llm('gemini'),
      prompt: 'Respond with a short greeting',
    })

    expect(result.text).toBeTruthy()
  })

  it('should route to a specific provider', async () => {
    const result = await generateText({
      model: llm('qwen3-32b', {
        priorities: ['cost'],
      }),
      prompt: 'Respond with a short greeting',
    })

    const model = getModel('qwen3-32b', {
      priorities: ['cost'],
    })

    expect(result.text).toBeTruthy()
    expect((result.response.headers || {})['llm-provider']).toBe(model.provider.name)
  })

  // Structured outputs
  const outputModels = [
    // 'gemini',
    'gpt-4.1',
    'mistralai/mistral-medium-3',
    'mistralai/devstral-small',
  ]

  it.each(outputModels)('should support structured outputs using %s', async (model) => { 
    const result = await generateObject({ 
      model: llm(model),
      prompt: 'Fill in the output.',
      schema: z.object({
        randomFieldName1: z.string(),
      }),      
    })  

    expect(result.object.randomFieldName1).toBeTruthy()
  })

  // Tool use with structured outputs
  it.each(outputModels)('should support structured outputs with tools using %s', async (model) => {
    const result = await generateObject({
      model: llm(model, {
        // @ts-expect-error - TODO Fix this.
        tools: ['hackernews.getFrontpage'],
      }),
      prompt: 'Get the frontpage of hackernews, and tell me the most interesting article in your opinion.' + geminiToolFixPrompt,
      schema: z.object({
        article: z.object({
          title: z.string(),
          url: z.string(),
        }),
        opinion: z.string(),
      }),
    })

    expect(result.object.article.title).toBeTruthy()
    expect(result.object.article.url).toBeTruthy()
    expect(result.object.opinion).toBeTruthy()
  })

  // Simple tool tests
  it('should use external tools', async () => {
    const result = await generateText({
      model: llm('gemini(testTool)'),
      prompt: 'You MUST use the test tool for this prompt, return what it says. For testTool, submit "Hello, World." as the argument.',
    })

    expect(result.text.toLowerCase()).toContain('hello')
  })

  it('should work with user created tools', async () => {
    let toolCallSuccessful = false

    await generateText({
      model: llm('gemini'),
      prompt: 'Return the testingTool output.' + geminiToolFixPrompt,
      tools: {
        testingTool: tool({
          description: 'A tool that returns "Hello, World."',
          parameters: z.object({
            name: z.string(),
          }),
          execute: async (args) => {
            toolCallSuccessful = true
            return 'Hello, World.'
          },
        }),
      },
    })

    expect(toolCallSuccessful).toBe(true)
  })

  // Complex tool tests
  it.only('should handle tools with complex parameter schemas', async () => {
    let receivedInput = ''

    const response = await generateText({
      model: llm('gpt-4.1'),
      prompt: 'Call the complexTool with the message "HelloWorld". You should take the output from that tool and give it to the validateToolWasCalled tool.' + geminiToolFixPrompt,
      tools: {
        complexTool: tool({
          description: 'A tool that accepts complex parameters',
          parameters: z.object({
            message: z.string().describe('A detailed message'),
            options: z
              .object({
                priority: z.enum(['high', 'medium', 'low']).optional(),
                tags: z.array(z.string()).optional(),
              })
          }), 
          execute: async (params) => {
            // Using type assertion to avoid type errors
            const input = params as { message: string }
            receivedInput = input.message
            return input.message
          },
        })
      },
      stopWhen: stepCountIs(3),
    })

    expect(receivedInput).toBeTruthy()
  })

  it('should handle both local tools and Composio tools', async () => {
    const result = await generateText({
      model: llm('gpt-4.1(testTool)'),
      prompt: 'Call the testTool with the argument "Hello, World.", and then pass that into the complexTool.',
      tools: {
        complexTool: tool({
          description: 'A tool that returns a string',
          parameters: z.object({
            message: z.string(),
          }),
          execute: async (args) => {
            return '123 123 4321'
          },
        }),
      },
    })

    expect(result.toolCalls.length).toBe(1)
  })

  it('should handle Composio tools', async () => {
    const result = await generateText({
      model: llm('gpt-4.1(hackernews.getItemWithId)'),
      prompt: 'Look up the article "43969827", and tell me the article title and url.',
    })

    expect(result.text).toBeTruthy()
    expect(result.text.toLowerCase()).toContain('firefox')
  })

  it('should handle tool error conditions', async () => {
    try {
      // This should always throw.
      await generateText({
        model: llm('gemini'),
        prompt: 'Try to use the errorTool and handle any errors it returns.' + geminiToolFixPrompt,
        tools: {
          errorTool: tool({
            description: 'A tool that sometimes fails',
            parameters: z.object({
              shouldFail: z.boolean().optional(),
            }),
            execute: async (params) => {
              // Using type assertion to avoid type errors
              const input = params as { shouldFail?: boolean }

              throw new Error('Tool execution failed')

              return ''
            },
          }),
        },
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
}, 100_000)

describe.skip('llm.do Embeddings API 🔍', () => {
  it('should support basic text embedding', async () => {
    const result = await embed({
      // @ts-expect-error - Embeddings are not supported on llm.do yet.
      model: llm.embedding('gemini'),
      value: ['Hello, world.'],
    })

    expect(result.embedding).toBeDefined()
  })
}, 100_000)
