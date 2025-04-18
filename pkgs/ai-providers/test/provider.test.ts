import { describe, it, expect } from 'vitest'
import { generateObject, generateText } from 'ai'

import { llmProvider } from '../src'
import { z } from 'zod'

describe('provider', () => {
  it('should route to the correct model and provider', async () => {
    const model = llmProvider(
      'gemini',
      {
        allowFixingSchema: true
      }
    )

    console.log(model)

    const test = await generateText({
      model,
      prompt: 'Return some text',
    })

    expect(test.text).toBeDefined()
    expect(test.text).not.toBe('')
    // If this is set, it means we're using Google's API.
    expect(test.providerMetadata?.google).toBeDefined()
  })

  it('should generate an object using Claude', async () => {
    const model = llmProvider('claude-3.7-sonnet')

    const test = await generateObject({
      model,
      prompt: 'Return some text',
      schema: z.object({
        text: z.string(),
      }),
    })

    console.log(test)
  })
})