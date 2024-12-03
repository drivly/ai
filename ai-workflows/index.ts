import { generateObject } from 'ai'
import type { LanguageModel } from 'ai'
import { openai } from '@ai-sdk/openai'

type AIConfig = Partial<Parameters<typeof generateObject>[0]>

export const AI = (config: AIConfig = {}) => {
  
  return {
    ai: new Proxy({}, {
      get: async (target, property) => {
        // return await generateObject({
        //   model: openai('gpt-4o'),
        //   prompt: `You are a helpful assistant.`,
        // })
      },
      apply: async (target, thisArg, argumentsList) => {
        // return await generateObject({
        //   model: 'gpt-4o',
        //   prompt: `You are a helpful assistant.`,
        // })
      },
    })
  }
}

export const ai = AI().ai
