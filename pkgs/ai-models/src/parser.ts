import { Capability } from './types';

/**
 * Parse a model string into its provider, author, model, and capabilities
 * Format: provider/author/model:capabilities
 * Example: openai/openai/gpt-4o:code,reasoning,online
 */
export function parseModelIdentifier(modelId: string): {
  provider: string;
  author: string;
  model: string;
  capabilities: Capability[];
} {
  const [modelPath, capabilitiesStr] = modelId.split(':');
  const parts = modelPath.split('/');
  
  // Default to OpenAI if no provider specified
  if (parts.length === 1) {
    return {
      provider: 'openai',
      author: 'openai',
      model: parts[0],
      capabilities: capabilitiesStr ? capabilitiesStr.split(',') as Capability[] : [],
    };
  }
  
  // Provider and model specified
  if (parts.length === 2) {
    return {
      provider: parts[0],
      author: parts[0],
      model: parts[1],
      capabilities: capabilitiesStr ? capabilitiesStr.split(',') as Capability[] : [],
    };
  }
  
  // Provider, author and model specified
  return {
    provider: parts[0],
    author: parts[1],
    model: parts[2],
    capabilities: capabilitiesStr ? capabilitiesStr.split(',') as Capability[] : [],
  };
}

/**
 * Creates a model identifier string from components
 */
export function createModelIdentifier({
  provider,
  author,
  model,
  capabilities = [],
}: {
  provider: string;
  author: string;
  model: string;
  capabilities?: Capability[];
}): string {
  const modelPath = [provider, author, model].join('/');
  return capabilities.length > 0
    ? `${modelPath}:${capabilities.join(',')}`
    : modelPath;
}
