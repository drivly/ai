import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { groq } from '@ai-sdk/groq'
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { google } from '@ai-sdk/google'
import { perplexity } from '@ai-sdk/perplexity'
import { createProviderRegistry } from 'ai'


export const registry = createProviderRegistry(
  {
    anthropic,
    openai,
    xai,
    groq,
    bedrock,
    google,
    perplexity
  },
  { separator: '/' },
)

export const { languageModel } = registry
