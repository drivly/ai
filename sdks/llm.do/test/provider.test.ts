import { describe, it, expect } from 'vitest'
import { generateText } from 'ai'
import { createLLMProvider } from '../src'

describe('llm.do provider', () => {
  it('should create a provider', async () => {
    const llm = createLLMProvider({
      baseURL: `${ process.env.NEXT_PREVIEW_URL ?? 'http://localhost:3000' }/llm` 
    })

    const result = await generateText({
      model: llm('gemini(testTool)'),
      prompt: 'You MUST use the test tool for this prompt, return what it says. For testTool, submit "Hello, World." as the argument.'
    })

    expect(result.text.toLowerCase()).toContain('hello')
  })
}, 100_000)