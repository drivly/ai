import { describe, it, expect } from 'vitest'
import { generateText, streamText } from '../src'
import { z } from 'zod'

describe('provider', () => {
  it('should route to the correct model and provider', async () => {
    const test = await generateText({
      model: 'gemini',
      prompt: 'Tell me a joke'
    })

    expect(test.text).toBeDefined()
    expect(test.text).not.toBe('')
    // If this is set, it means we're using Google's API.
    //expect(test.providerMetadata?.google).toBeDefined()
  })

  it('should call tools when provided', async () => {
    const test = await generateText({
      model: 'gemini(slack.usersList)',
      user: 'connor@driv.ly',
      prompt: 'Tell me who is in this slack. Set all arguments to default values (false, 0, null)',
      maxSteps: 10
    })

    expect(test.text).toBeDefined()
    expect(test.text).not.toBe('')
    // If this is set, it means we're using Google's API.
    //expect(test.providerMetadata?.google).toBeDefined()

    // If we've sent a tool call back to the AI, this should be greater than 0.
    expect(test.steps.filter(step => step.finishReason === 'tool-calls').length).toBeGreaterThan(0)
  })

  it('should stream text from a tool', async () => {
    const stream = await streamText({
      model: 'gemini(slack.usersList)',
      prompt: 'List all of the users in this slack',
      user: 'connor@driv.ly',
      maxSteps: 3
    })

    const buffer: string[] = []
    
    for await (const textPart of stream.textStream) {
      buffer.push(textPart)
    }

    expect(buffer.join('')).toBeDefined()
    expect(buffer.join('')).not.toBe('')
  })
}, {
  timeout: 100000
})
