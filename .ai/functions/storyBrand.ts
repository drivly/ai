import { model } from '@/lib/ai'
import { generateObject } from 'ai'
import yaml from 'yaml'
import { z } from 'zod'

export const storyBrand = (
  input: any,
  {
    modelName = 'google/gemini-2.5-pro-preview-03-25',
    system = 'You are an expert business consultant specializing in the StoryBrand framework for clarifying marketing messages',
    temperature = 0.7,
  } = {},
) =>
  generateObject({
    model: model(modelName, { structuredOutputs: true }),
    system,
    prompt: `Create a StoryBrand framework for: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature,
    schema: z.object({
      productName: z.string().describe('name of the product or service'),
      hero: z.string().describe('description of the customer and their challenges'),
      problem: z.object({
        external: z.string().describe('tangible external problem the customer faces'),
        internal: z.string().describe('internal frustration caused by the external problem'),
        philosophical: z.string().describe('why this matters on a deeper level'),
        villain: z.string().describe('antagonistic force causing the problem'),
      }),
      guide: z.string().describe('how the brand positions itself as a guide with empathy and authority'),
      plan: z.array(z.string()).describe('clear steps the customer needs to take'),
      callToAction: z.string().describe('specific action the customer should take'),
      success: z.string().describe('description of what success looks like after using the product'),
      failure: z.string().describe("description of what failure looks like if they don't use the product"),
      messagingExamples: z.array(z.string()).describe('example marketing messages based on this framework'),
    }),
  }).then((result) => {
    return result.object
  })
