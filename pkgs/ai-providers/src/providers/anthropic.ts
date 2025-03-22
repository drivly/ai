import { anthropic } from '@ai-sdk/anthropic';

export class AnthropicProvider {
  id = 'anthropic';
  name = 'Anthropic';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Create a provider instance with the specified model
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
