import { Provider } from '../types';
import { openai, createOpenAI } from '@ai-sdk/openai';

export class OpenAIProvider implements Provider {
  id = 'openai';
  name = 'OpenAI';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Use the default provider or create a custom one with API key
    if (apiKey) {
      const customProvider = createOpenAI({
        apiKey: apiKey,
      });
      return customProvider(modelId);
    }
    
    // Use the default provider
    return openai(modelId);
  }
  
  supportsModel(model: string): boolean {
    const openaiModels = [
      'gpt-4', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-vision', 
      'gpt-4-turbo', 'gpt-4-0125-preview'
    ];
    return openaiModels.some(m => model.includes(m));
  }
}
