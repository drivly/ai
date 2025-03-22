import { Provider, ProviderRequestOptions, ProviderResponse } from '../types';

export class LLMdoProvider implements Provider {
  id = 'llmdo';
  name = 'LLM.do';
  
  async generateText(options: ProviderRequestOptions): Promise<ProviderResponse> {
    const { model, prompt, apiKey } = options;
    
    // This would use the LLM.do API which provides an OpenAI-compatible interface
    const response = await fetch('https://api.llm.do/v1/chat/completions', {
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
  
  // This is the fallback provider, so it supports all models
  supportsModel(_model: string): boolean {
    return true;
  }
}
