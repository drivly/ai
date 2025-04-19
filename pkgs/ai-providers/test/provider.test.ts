import { describe, it, expect } from 'vitest'
import { generateObject, generateText } from 'ai'

import { model } from '../src'
import { z } from 'zod'

describe('provider', () => {
  it('should route to the correct model and provider', async () => {
    const model1 = model(
      'gemini',
      {
        allowFixingSchema: true
      }
    )

    console.log(model1)

    const test = await generateText({
      model: model1,
      prompt: 'Return some text',
    })

    expect(test.text).toBeDefined()
    expect(test.text).not.toBe('')
    // If this is set, it means we're using Google's API.
    expect(test.providerMetadata?.google).toBeDefined()
  })

  it('should generate an object using Claude', async () => {
    const model2 = model('claude-3.7-sonnet')

    const test = await generateObject({
      model: model2,
      prompt: 'Return some text',
      schema: z.object({
        text: z.string(),
      }),
    })

    console.log(test)
  })
})