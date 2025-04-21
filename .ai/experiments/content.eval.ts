import { experiment } from 'experiments.do'
import { domains } from '@/.velite'
import { z } from 'zod'

experiment({
  models: [
    'google/gemini-2.5-pro-preview-03-25',
    'google/gemini-2.5-flash-preview',
    'openai/gpt-4.5-preview',
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4.1-nano',
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-4-scout',
  ],
  data: domains,
  system: [undefined, 'You are an expert at content marketing for startups', 'You are a YC Group Partner'],
  prompt: JSON.stringify,
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