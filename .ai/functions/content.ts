// import { model } from 'ai-providers'
import { model } from '@/lib/ai'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'




export const research = (topic: string) => generateText({
  model: model('perplexity/sonar-deep-research'),
  prompt: `Research ${topic}`,
}).then(result => {
  return {
    citations: (result.response.body as any)?.citations,
    markdown: result.text
  }
})
