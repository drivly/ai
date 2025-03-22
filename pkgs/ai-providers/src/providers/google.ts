export class GoogleProvider {
  id = 'google';
  name = 'Google AI';
  
  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    return { id: modelId, provider: this.id };
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
