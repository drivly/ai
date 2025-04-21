import { experiment } from 'experiments.do'
import { z } from 'zod'

experiment('content-evaluation', {
  models: [
    'google/gemini-2.5-pro-preview-03-25',
    'google/gemini-2.5-flash-preview',
    'google/gemini-2.0-flash-001',
    'google/gemini-2.0-flash-lite-001',
    'openai/gpt-4.5-preview',
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4.1-nano',
    'anthropic/claude-3.7-sonnet',
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-4-scout',
    'x-ai/grok-3-beta',
    'x-ai/grok-3-mini-beta',
  ],
  data: [],
  system: [undefined, 'You are an expert at content marketing for startups', 'You are a YC Group Partner'],
  prompt: ({ input }: { input: any }) => [JSON.stringify(input)],
  schema: z.object({
    seoTitle: z.string(),
    seoDescription: z.string(),
    seoKeywords: z.array(z.string()),
    heroHeadline: z.string(),
    heroSubheadline: z.string(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    benefits: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  }),
})
