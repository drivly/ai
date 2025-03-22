import { Provider, ProviderRequestOptions, ProviderResponse } from '../types';

export class OpenAIProvider implements Provider {
  id = 'openai';
  name = 'OpenAI';
  
  async generateText(options: ProviderRequestOptions): Promise<ProviderResponse> {
    const { model, prompt, apiKey } = options;
    
    // This would be a real implementation using the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    }).then(res => res.json());
    
    return {
      text: response.choices[0].message.content,
      model,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
    };
  }
  
  supportsModel(model: string): boolean {
    const openaiModels = [
      'gpt-4', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-vision', 
      'gpt-4-turbo', 'gpt-4-0125-preview'
    ];
    return openaiModels.some(m => model.includes(m));
  }
}
