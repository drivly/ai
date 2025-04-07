import { anthropic } from '@ai-sdk/anthropic'
import { deepseek } from '@ai-sdk/deepseek'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createProviderRegistry } from 'ai'

const compatible = createOpenAICompatible({
  name: 'compatible',
  baseURL: process.env.OPENAI_COMPATIBLE_BASE_URL || '',
})

export const registry = createProviderRegistry(
  {
    anthropic,
    deepseek,
    google,
    openai,
    compatible,
  },
  { separator: '/' },
)
