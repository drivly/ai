import { Capability, ModelConfig, ModelResult } from './types';
import { parseModelIdentifier } from './parser';

// For demo purposes only - in a real implementation, this would be fetched from an API
const availableModels: ModelResult[] = [
  {
    id: 'openai/openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    capabilities: ['code', 'reasoning', 'online', 'vision'],
  },
  {
    id: 'anthropic/anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    capabilities: ['code', 'reasoning', 'vision'],
  },
  {
    id: 'google/google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    capabilities: ['code', 'reasoning'],
  },
];

/**
 * Select a model based on capabilities and preferences
 */
export function getModel(
  modelInput: string | string[],
  config?: ModelConfig
): ModelResult | null {
  const { requiredCapabilities = [], preferredModels = [] } = config || {};
  
  // If a specific model was requested
  if (typeof modelInput === 'string') {
    const parsed = parseModelIdentifier(modelInput);
    
    // Check if we have this exact model
    const exactMatch = availableModels.find(m => 
      m.provider === parsed.provider &&
      m.name.includes(parsed.model)
    );
    
    if (exactMatch) return exactMatch;
    
    // If not found, will fall through to capability-based selection
  }
  
  // Filter models that have all required capabilities
  const candidates = availableModels.filter(model => {
    return requiredCapabilities.every(cap => 
      model.capabilities.includes(cap)
    );
  });
  
  if (candidates.length === 0) return null;
  
  // Sort by preferred models
  const sorted = [...candidates].sort((a, b) => {
    const aPreferredIndex = preferredModels.findIndex(pm => a.id.includes(pm));
    const bPreferredIndex = preferredModels.findIndex(pm => b.id.includes(pm));
    
    // If both are in preferred list, sort by their order in the list
    if (aPreferredIndex >= 0 && bPreferredIndex >= 0) {
      return aPreferredIndex - bPreferredIndex;
    }
    
    // If only one is in preferred list, prioritize it
    if (aPreferredIndex >= 0) return -1;
    if (bPreferredIndex >= 0) return 1;
    
    // Default sort by number of capabilities (more is better)
    return b.capabilities.length - a.capabilities.length;
  });
  
  return sorted[0];
}
