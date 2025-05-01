import { describe, it, expect } from 'vitest'
import { generateText, tool } from 'ai'
import { createLLMProvider } from '../src'
import { z } from 'zod'

const llm = createLLMProvider({
  baseURL: `${ process.env.NEXT_PREVIEW_URL ?? 'http://localhost:3000' }/llm` 
})

describe('llm.do provider', () => {
  it('should use external tools', async () => {
    const result = await generateText({
      model: llm('gemini(testTool)'),
      prompt: 'You MUST use the test tool for this prompt, return what it says. For testTool, submit "Hello, World." as the argument.'
    })

    expect(result.text.toLowerCase()).toContain('hello')
  })

  it('should work with user created tools', async () => {
    let toolCallSuccessful = false

    await generateText({
      model: llm('gemini'),
      prompt: 'Return the testingTool output. Dont ask for the arguments, use your best judgement.',
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
}, 100_000)