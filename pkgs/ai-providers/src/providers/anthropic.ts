import { Provider, ProviderRequestOptions, ProviderResponse } from '../types';

export class AnthropicProvider implements Provider {
  id = 'anthropic';
  name = 'Anthropic';
  
  async generateText(options: ProviderRequestOptions): Promise<ProviderResponse> {
    const { model, prompt, apiKey } = options;
    
    // This would be a real implementation using the Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey as string,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    }).then(res => res.json());
    
    return {
      text: response.content[0].text,
      model,
      // Anthropic doesn't provide usage info in the same format
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }
  
  supportsModel(model: string): boolean {
    const anthropicModels = [
      'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 
      'claude-2', 'claude-instant'
    ];
    return anthropicModels.some(m => model.includes(m));
  }
}
