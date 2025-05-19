import { describe, it, expect } from 'vitest'
import { generateText, tool, embed, generateObject } from 'ai'
import { createLLMProvider } from '../src'
import { getModel } from '@/pkgs/language-models'
import { z } from 'zod'

const llm = createLLMProvider({
  baseURL: `${ process.env.NEXT_PREVIEW_URL ?? 'http://localhost:3000' }/llm` 
})

const geminiToolFixPrompt = ' Do not ask for arguments to a tool, use your best judgement. If you are unsure, return null.'

describe('llm.do Chat Completions 💭', () => {
  // Basic functionality tests
  it('should support basic text generation', async () => {
    const result = await generateText({
      model: llm('gemini'),
      prompt: 'Respond with a short greeting'
    })
  
    expect(result.text).toBeTruthy()
  })

  it.only('should route to a specific provider', async () => {
    const result = await generateText({
      model: llm(
        'qwen3-32b',
        {
          providerPriorities: ['cost']
        }
      ),
      prompt: 'Respond with a short greeting'
    })

    const model = getModel(
      'qwen3-32b',
      {
        providerPriorities: ['cost'],
        
      }
    )

    console.log(
      result
    )

    expect(result.text).toBeTruthy()
    // @ts-expect-error - body is not typed
    expect(result.response.body?.provider.name).toBe(model.provider.name)
  })

  // Structured outputs
  it('should support structured outputs', async () => {
    const result = await generateObject({
      model: llm('gemini'),
      prompt: 'Respond with a short greeting',
      schema: z.object({
        greeting: z.string()
      })
    })

    expect(result.object.greeting).toBeTruthy()
  })

  // Currently broken inside AI SDK.
  it.skip('should support structured outputs with tools', async () => {
    const result = await generateObject({
      model: llm('gemini'),
      prompt: 'Use the greeting tool to generate a greeting to return. Person name must be "Connor"' + geminiToolFixPrompt,
      schema: z.object({
        greeting: z.string()
      }),
      tools: {
        greetingTool: tool({
          description: 'A tool that returns a greeting',
          parameters: z.object({
            personName: z.string()
          }),
          execute: async (args) => {
            return `Hello, ${args.personName}!`
          }
        })
      }
    })

    expect(result.object.greeting).toBeTruthy()
  })

  // Simple tool tests
  it('should use external tools', async () => {
    const result = await generateText({
      model: llm('gemini(testTool)'),
      prompt: 'You MUST use the test tool for this prompt, return what it says. For testTool, submit "Hello, World." as the argument.'
    })

    expect(result.text.toLowerCase()).toContain('hello')
  })

  it.skip('should use both tools and JSON output mode', async () => {
    const result = await generateObject({
      model: llm(
        'gemini',
        {
          tools: [ 'hackernews.getFrontpage' ]
        }   
      ),
      prompt: 'Get me the frontpage of hackernews.',
      schema: z.object({
        title: z.string(),
        url: z.string()
      })
    })

    console.log(
      result
    )
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
            name: z.string()
          }),
          execute: async (args) => {
            toolCallSuccessful = true
            return 'Hello, World.'
          }
        })
      }
    })

    expect(toolCallSuccessful).toBe(true)
  })

  // Complex tool tests
  it('should handle tools with complex parameter schemas', async () => {
    let receivedInput = ''
    
    const response = await generateText({
      model: llm('gemini'),
      prompt: 'Call the complexTool with a detailed message. Then return the result of the complexTool. You must use the complexTool.' + geminiToolFixPrompt,
      tools: {
        complexTool: tool({
          description: 'A tool that accepts complex parameters',
          parameters: z.object({
            message: z.string().describe('A detailed message'),
            options: z.object({
              priority: z.enum(['high', 'medium', 'low']).optional(),
              tags: z.array(z.string()).optional()
            }).optional()
          }),
          execute: async (params) => {
            // Using type assertion to avoid type errors
            const input = params as { message: string }
            receivedInput = input.message
            return `Processed: ${input.message}`
          }
        })
      },
      maxSteps: 3
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
            message: z.string()
          }),
          execute: async (args) => {
            return '123 123 4321'
          }
        })
      }
    })

    expect(result.toolCalls.length).toBe(1)
  })

  it('should handle Composio tools', async () => {
    const result = await generateText({
      model: llm('gpt-4.1(hackernews.getItemWithId)'),
      prompt: 'Look up the article "43969827", and tell me the article title and url.'
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
              shouldFail: z.boolean().optional()
            }),
            execute: async (params) => {
              // Using type assertion to avoid type errors
              const input = params as { shouldFail?: boolean }
              
              throw new Error('Tool execution failed')

              return ''
            }
          })
        }
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
      value: ['Hello, world.']
    })

    expect(result.embedding).toBeDefined()
  })
}, 100_000)