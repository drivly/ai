import { Provider } from './types'
import { OpenAIProvider } from './providers/openai'
import { AnthropicProvider } from './providers/anthropic'
import { GoogleProvider } from './providers/google'
import { LLMdoProvider } from './providers/llmdo'
import { ParasailProvider } from './providers/parasail'
import { OpenRouterProvider } from './providers/openrouter'
import { CloudflareProvider } from './providers/cloudflare'
import { GoogleVertexProvider } from './providers/google-vertex'
import { GoogleAIStudioProvider } from './providers/google-ai-studio'

export class ProviderRouter {
  private providers: Provider[] = []
  private fallbackProvider: Provider

  constructor() {
    // Add providers in order of preference
    this.providers = [
      new OpenAIProvider(),
      new AnthropicProvider(),
      new GoogleProvider(),
      new ParasailProvider(),
      new OpenRouterProvider(),
      new CloudflareProvider(),
      new GoogleVertexProvider(),
      new GoogleAIStudioProvider(),
    ]

    // LLM.do is the fallback provider
    this.fallbackProvider = new LLMdoProvider()
  }

  /**
   * Get an appropriate provider based on model ID
   */
  getProviderForModel(modelId: string): Provider {
    // First check if any provider directly supports this model
    const directProvider = this.providers.find((p) => p.supportsModel(modelId))
    if (directProvider) return directProvider

    // Fall back to LLM.do
    return this.fallbackProvider
  }
}
