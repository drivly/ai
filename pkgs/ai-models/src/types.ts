export type Capability = 'code' | 'reasoning' | 'online' | 'vision' | 'audio' | string;

export interface ModelConfig {
  requiredCapabilities?: Capability[];
  preferredModels?: string[];
}

export interface ModelResult {
  id: string;
  name: string;
  provider: string;
  capabilities: Capability[];
}
