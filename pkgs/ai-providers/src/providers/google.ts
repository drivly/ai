import { Provider } from '../types';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';

export class GoogleProvider implements Provider {
  id = 'google';
  name = 'Google AI';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Use the default provider or create a custom one with API key
    if (apiKey) {
      const customProvider = createGoogleGenerativeAI({
        apiKey: apiKey,
      });
      return customProvider(modelId);
    }
    
    // Use the default provider
    return google(modelId);
  }
  
  supportsModel(model: string): boolean {
    const googleModels = [
      'gemini-pro', 'gemini-ultra', 
      'gemini-1.5-pro', 'gemini-1.5-flash',
      'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest'
    ];
    return googleModels.some(m => model.includes(m));
  }
}
