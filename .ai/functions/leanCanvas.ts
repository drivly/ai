import { model } from '@/lib/ai'
import { generateObject } from 'ai'
import yaml from 'yaml'
import { z } from 'zod'

export const leanCanvas = (
  input: any,
  {
    modelName = 'google/gemini-2.5-pro-preview-03-25',
    system = 'You are an expert business consultant specializing in the Lean Canvas methodology for business model generation',
    temperature = 0.7,
  } = {},
) =>
  generateObject({
    model: model(modelName, { structuredOutputs: true }),
    system,
    prompt: `Create a Lean Canvas business model for: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature,
    schema: z.object({
      productName: z.string().describe('name of the product or service'),
      problem: z.array(z.string()).describe('top 3 problems the product solves'),
      solution: z.array(z.string()).describe('top 3 solutions the product offers'),
      uniqueValueProposition: z.string().describe('clear message that states the benefit of your product'),
      unfairAdvantage: z.string().describe('something that cannot be easily copied or bought'),
      customerSegments: z.array(z.string()).describe('list of target customer segments'),
      keyMetrics: z.array(z.string()).describe('list of key numbers that tell you how your business is doing'),
      channels: z.array(z.string()).describe('path to customers'),
      costStructure: z.array(z.string()).describe('list of operational costs'),
      revenueStreams: z.array(z.string()).describe('list of revenue sources'),
      recommendations: z.array(z.string()).describe('list of recommendations based on the analysis'),
    }),
  }).then((result) => {
    return result.object
  })
