/**
 * AI Models Package
 * Stub implementation to fix build errors
 */

export type Capability = 'reasoning' | 'tools' | 'code' | 'online';

export interface ParsedModelIdentifier {
  provider: string;
  model: string;
  capabilities: Capability[];
  systemConfig?: {
    seed?: number;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  };
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  capabilities: Capability[];
}

export const models: Model[] = [];

export function getModel(modelName: string): { model: Model; parsed: ParsedModelIdentifier } | null {
  return null;
}

export function reconstructModelString(parsed: ParsedModelIdentifier): string {
  return '';
}

export function parse(modelString: string): ParsedModelIdentifier {
  return {
    provider: '',
    model: '',
    capabilities: []
  };
}

export function getModels(): Model[] {
  return models;
}

export const modelPattern = '';
