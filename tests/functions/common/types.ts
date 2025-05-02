/**
 * Common interface for all AI implementations
 */
export interface AIImplementation {
  name: string;
  AI: <T extends Record<string, any>>(config: T) => any;
  ai?: any;
  list?: any;
  markdown?: any;
}

/**
 * Configuration for test environment
 */
export interface TestEnvConfig {
  AI_GATEWAY_URL?: string;
  AI_GATEWAY_TOKEN?: string;
  [key: string]: string | undefined;
}
