export interface ProviderRequestOptions {
  model: string;
  prompt: string;
  apiKey?: string;
  [key: string]: any;
}

export interface ProviderResponse {
  text: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  [key: string]: any;
}

export interface Provider {
  id: string;
  name: string;
  generateText(options: ProviderRequestOptions): Promise<ProviderResponse>;
  supportsModel(model: string): boolean;
}
