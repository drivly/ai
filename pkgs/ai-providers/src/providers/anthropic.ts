import { Provider } from '../types';
import { anthropic, createAnthropic } from '@ai-sdk/anthropic';

export class AnthropicProvider implements Provider {
  id = 'anthropic';
  name = 'Anthropic';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Use the default provider or create a custom one with API key
    if (apiKey) {
      const customProvider = createAnthropic({
        apiKey: apiKey,
      });
      return customProvider(modelId);
    }
    
    // Use the default provider
    return anthropic(modelId);
  }
  
  supportsModel(model: string): boolean {
    const anthropicModels = [
      'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 
      'claude-2', 'claude-instant'
    ];
    return anthropicModels.some(m => model.includes(m));
  }
}
