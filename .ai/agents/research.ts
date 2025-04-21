import { createOpenAI } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { z } from 'zod'

const model = createOpenAI({
  apiKey: process.env.AI_GATEWAY_TOKEN!,
  baseURL: process.env.AI_GATEWAY_URL!,
  headers: {
    'HTTP-Referer': 'https://workflows.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Workflows.do Business-as-Code', // Optional. Site title for rankings on openrouter.ai.
  },
})

export const research = (topic: string) =>
  generateText({
    model: model('perplexity/sonar-deep-research'),
    prompt: `Research ${topic}`,
  }).then((result) => {
    return {
      citations: (result.response.body as any)?.citations,
      markdown: result.text,
    }
  })
