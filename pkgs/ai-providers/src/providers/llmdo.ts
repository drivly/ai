import { Provider } from '../types';
import { openai, createOpenAI } from '@ai-sdk/openai';

export class LLMdoProvider implements Provider {
  id = 'llmdo';
  name = 'LLM.do';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Create a custom provider for LLM.do (OpenAI compatible)
    const llmdoProvider = createOpenAI({
      apiKey: apiKey || process.env.LLMDO_API_KEY || '',
      baseURL: 'https://api.llm.do/v1',
    });
    
    return llmdoProvider(modelId);
  }
  
  // This is the fallback provider, so it supports all models
  supportsModel(_model: string): boolean {
    return true;
  }
}
