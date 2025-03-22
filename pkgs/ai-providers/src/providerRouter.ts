import { getModel } from 'ai-models';
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
  
  async generateText(options: ProviderRequestOptions): Promise<ProviderResponse> {
    const { model } = options;
    
    // Find provider that supports this model
    const provider = this.providers.find(p => p.supportsModel(model));
    
    if (provider) {
      return provider.generateText(options);
    }
    
    // Fall back to LLM.do
    return this.fallbackProvider.generateText(options);
  }
  
  /**
   * Get an appropriate provider based on model metadata
   */
  getProviderForModel(modelId: string): Provider {
    // First check if any provider directly supports this model
    const directProvider = this.providers.find(p => p.supportsModel(modelId));
    if (directProvider) return directProvider;
    
    // Otherwise, use capability-based routing
    const modelInfo = getModel(modelId);
    if (modelInfo) {
      const provider = this.providers.find(p => p.id === modelInfo.provider);
      if (provider) return provider;
    }
    
    // Fall back to LLM.do
    return this.fallbackProvider;
  }
}
