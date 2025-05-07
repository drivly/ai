import fs from 'node:fs/promises'
import path from 'node:path'

const CONFIG_FILE = '.mdxai.json'

export interface AIConfig {
  apiKey?: string
  baseURL?: string
  defaultModel?: string
}

export interface RuntimeConfig {
  ai: AIConfig
  outputDir?: string
  onProgress?: (progress: number, message: string) => void
}

/**
 * Load configuration from .mdxai.json
 * @param configPath Optional path to config file
 * @returns Configuration object
 */
export async function loadConfig(configPath?: string): Promise<RuntimeConfig> {
  const configFilePath = configPath || path.join(process.cwd(), CONFIG_FILE)
  
  try {
    const configData = await fs.readFile(configFilePath, 'utf-8')
    const config = JSON.parse(configData)
    
    return mergeWithEnv(config)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return getDefaultConfig()
    }
    
    throw new Error(`Failed to load configuration: ${(error as Error).message}`)
  }
}

/**
 * Save configuration to .mdxai.json
 * @param config Configuration object
 * @param configPath Optional path to config file
 */
export async function saveConfig(config: RuntimeConfig, configPath?: string): Promise<void> {
  const configFilePath = configPath || path.join(process.cwd(), CONFIG_FILE)
  
  try {
    const safeConfig = {
      ...config,
      ai: {
        ...config.ai,
        apiKey: config.ai.apiKey ? '[REDACTED]' : undefined
      }
    }
    
    await fs.writeFile(configFilePath, JSON.stringify(safeConfig, null, 2))
  } catch (error) {
    throw new Error(`Failed to save configuration: ${(error as Error).message}`)
  }
}

/**
 * Get configuration based on runtime environment
 * @param options User-provided options
 * @returns Runtime configuration
 */
export function getConfig(options?: Partial<RuntimeConfig>): RuntimeConfig {
  const config = getDefaultConfig()
  
  if (options) {
    return {
      ...config,
      ...options,
      ai: {
        ...config.ai,
        ...(options.ai || {})
      }
    }
  }
  
  return config
}

/**
 * Get default configuration
 * @returns Default configuration
 */
function getDefaultConfig(): RuntimeConfig {
  const aiConfig = getAIConfigFromEnv()
  
  return {
    ai: aiConfig,
    outputDir: './'
  }
}

/**
 * Get AI configuration from environment variables
 * @returns AI configuration
 */
function getAIConfigFromEnv(): AIConfig {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.AI_MODEL || 'gpt-4o-mini'
  const aiGateway = process.env.AI_GATEWAY
  
  if (!apiKey && !aiGateway) {
    throw new ConfigurationError(
      'No AI provider configuration found. Please set OPENAI_API_KEY or AI_GATEWAY environment variable.'
    )
  }
  
  if (model.startsWith('@cf/')) {
    return {
      apiKey: process.env.CF_WORKERS_AI_TOKEN,
      defaultModel: model,
    }
  }
  
  if (aiGateway) {
    return {
      apiKey,
      baseURL: aiGateway,
      defaultModel: model
    }
  }
  
  return {
    apiKey,
    defaultModel: model
  }
}

/**
 * Merge configuration with environment variables
 * @param config Configuration object
 * @returns Merged configuration
 */
function mergeWithEnv(config: RuntimeConfig): RuntimeConfig {
  try {
    const envAIConfig = getAIConfigFromEnv()
    
    return {
      ...config,
      ai: {
        ...config.ai,
        ...envAIConfig
      }
    }
  } catch (error) {
    return config
  }
}

/**
 * Error thrown when AI provider configuration is missing
 */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}
