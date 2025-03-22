export class LLMdoProvider {
  id = 'llmdo';
  name = 'LLM.do';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    return { id: modelId, provider: this.id };
  }
  
  // This is the fallback provider, so it supports all models
  supportsModel(_model: string): boolean {
    return true;
  }
}
