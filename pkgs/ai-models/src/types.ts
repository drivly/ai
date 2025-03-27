// Types for @drivly/ai-utils

// All of our providers
export type Provider = 'drivly' | 'openai' | 'anthropic' | 'google' | 'openrouter' | 'cloudflare' | 'google-vertex' | 'google-ai-studio'

// All of the capabilities that we support as an enum
export const capabilities = ['code', 'online', 'reasoning', 'reasoning-low', 'reasoning-medium', 'reasoning-high', 'tools', 'structuredOutput', 'responseFormat'] as const

// A way for models to declare what they can do
export type Capability = (typeof capabilities)[number]

export type ThinkingLevel = 'low' | 'medium' | 'high'

// Object representing a model definition from a string
export interface ParsedModelIdentifier {
  provider?: Provider
  author?: string
  model: string
  capabilities: Capability[]
  thinkingLevel?: ThinkingLevel
  systemConfig?: Record<string, string | number>
  alias?: string
}

export interface ModelConfig {
  seed?: number
  requiredCapabilities?: Capability[]
}
