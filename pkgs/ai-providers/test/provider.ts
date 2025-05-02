import { describe, it, expect } from 'vitest'
import { generateObject, generateText } from 'ai'

import { model, models } from '../src'
import { z } from 'zod'

describe('provider', () => {
  it('should route to the correct model and provider', async () => {
    const model1 = model('gemini(discord.getGuild)', {
      allowFixingSchema: true
    })

    console.log(model1)

    const test = await generateText({
      model: model1,
      prompt: 'Tell me who this is: Server ID: 595317990191398933, user ID: 190092287722651648',
    })

    console.log(test)

    expect(test.text).toBeDefined()
    expect(test.text).not.toBe('')
    // If this is set, it means we're using Google's API.
    expect(test.providerMetadata?.google).toBeDefined()
  })

  // it('should generate an object using Claude', async () => {
  //   const model2 = model('claude-3.7-sonnet')

  //   const test = await generateObject({
  //     model: model2,
  //     prompt: 'Return some text',
  //     schema: z.object({
  //       text: z.string(),
  //     }),
  //   })

  //   console.log(test)
  // })

  // it('should return an array of model instances', () => {
  //   const modelInstances = models('gemini,claude-3.7-sonnet')

  //   expect(modelInstances).toBeInstanceOf(Array)
  //   expect(modelInstances.length).toBe(2)
  //   expect(modelInstances[0].modelId).toBe('gemini')
  //   expect(modelInstances[1].modelId).toBe('claude-3.7-sonnet')
  // })
})
