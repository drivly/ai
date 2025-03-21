export type { LanguageModel } from 'ai'

// Types for @drivly/ai-utils

// All of our providers
export type Provider = 'drivly' | 'openai' | 'anthropic' | 'google' | 'openrouter' | 'cloudflare' | 'google-vertex' | 'google-ai-studio'

// A way for models to declare what they can do
export type Capability = 'code' | 'online' | 'reasoning' | 'reasoning-low' | 'reasoning-medium' | 'reasoning-high' | 'tools' | 'structuredOutput' | 'responseFormat'

export type ThinkingLevel = 'low' | 'medium' | 'high'

// Object representing a model definition from a string
export interface ParsedModelIdentifier {
  provider?: Provider
  author?: string
  model: string
  capabilities: Capability[]
  thinkingLevel?: ThinkingLevel
}

export interface ModelConfig {
  preferredProviders?: Provider[]
  requiredCapabilities?: Capability[]
  fallbackModels?: string[]
  prioritizeBy?: 'performance' | 'cost' | 'latency' | 'quality'
}
