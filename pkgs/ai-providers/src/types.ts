import { LanguageModelV1 } from 'ai';

export interface Provider {
  id: string;
  name: string;
  getModel(modelId: string, apiKey?: string): LanguageModelV1;
  supportsModel(model: string): boolean;
}
