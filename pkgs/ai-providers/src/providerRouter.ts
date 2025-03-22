import { Provider, ProviderRequestOptions, ProviderResponse } from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { GoogleProvider } from './providers/google';
import { LLMdoProvider } from './providers/llmdo';

export class ProviderRouter {
  private providers: Provider[] = [];
  private fallbackProvider: Provider;
  
  constructor() {
    // Add providers in order of preference
    this.providers = [
      new OpenAIProvider(),
      new AnthropicProvider(),
      new GoogleProvider(),
    ];
    
    // LLM.do is the fallback provider
    this.fallbackProvider = new LLMdoProvider();
  }
  
  /**
   * Get an appropriate provider based on model ID
   */
  getProviderForModel(modelId: string): Provider {
    // First check if any provider directly supports this model
    const directProvider = this.providers.find(p => p.supportsModel(modelId));
    if (directProvider) return directProvider;
    
    // Fall back to LLM.do
    return this.fallbackProvider;
  }
}
