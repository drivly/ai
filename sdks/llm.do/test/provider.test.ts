import { describe, it, expect } from 'vitest'
import { generateText } from 'ai'
import { createLLMProvider } from '../src'

describe('llm.do provider', () => {
  it('should create a provider', async () => {
    const llm = createLLMProvider({
      apiKey: 'ignore',
      baseURL: `${ process.env.NEXT_PREVIEW_URL ?? 'http://localhost:3000' }/llm`,
      headers: {
        'Cookie': process.env.cookie as string
      }
    })

    const result = await generateText({
      model: llm('gemini(testTool)'),
      prompt: 'You MUST use the test tool for this prompt, return what it says.'
    })

    console.log(result.text) 
  })
}, 100_000)