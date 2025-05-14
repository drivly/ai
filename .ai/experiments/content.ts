import { experiment } from 'experiments.do'
import { domains } from '@/.velite'

import { siteContentSchema } from '../functions/content'

export const contentExperiment = () => experiment('Site Content Generation', {
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
  temperature: 1,
  seeds: 1,
  inputs: () => Promise.resolve(domains),
  system: [undefined, 'You are an expert at content marketing for startups', 'You are a YC Group Partner'],
  prompt: ({ input }: { input: any }) => [JSON.stringify(input)],
  schema: siteContentSchema,
})
