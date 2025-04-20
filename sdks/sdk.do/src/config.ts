import fs from 'node:fs'
import path from 'node:path'

export interface Config {
  token?: string
  [key: string]: any
}

export class ConfigManager {
  private configPath: string

  constructor(configPath: string) {
    this.configPath = configPath
  }

  /**
   * Load configuration from file
   */
  async load(): Promise<Config> {
    try {
      const configDir = path.dirname(this.configPath)
      await fs.promises.mkdir(configDir, { recursive: true })

      if (fs.existsSync(this.configPath)) {
        const configContent = await fs.promises.readFile(this.configPath, 'utf8')
        return JSON.parse(configContent)
      }
      return {}
    } catch (error) {
      console.error('Error loading config:', error instanceof Error ? error.message : String(error))
      return {}
    }
  }

  /**
   * Save configuration to file
   */
  async save(config: Config): Promise<void> {
    try {
      const configDir = path.dirname(this.configPath)
      await fs.promises.mkdir(configDir, { recursive: true })

      await fs.promises.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf8')
    } catch (error) {
      console.error('Error saving config:', error instanceof Error ? error.message : String(error))
      throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Update configuration with new values
   */
  async update(updates: Partial<Config>): Promise<Config> {
    const config = await this.load()
    const updatedConfig = { ...config, ...updates }
    await this.save(updatedConfig)
    return updatedConfig
  }

  /**
   * Get a specific configuration value
   */
  async get<T>(key: string): Promise<T | undefined> {
    const config = await this.load()
    return config[key] as T | undefined
  }

  /**
   * Set a specific configuration value
   */
  async set<T>(key: string, value: T): Promise<void> {
    const config = await this.load()
    config[key] = value
    await this.save(config)
  }

  /**
   * Remove a specific configuration value
   */
  async remove(key: string): Promise<void> {
    const config = await this.load()
    delete config[key]
    await this.save(config)
  }

  /**
   * Clear all configuration
   */
  async clear(): Promise<void> {
    await this.save({})
  }
}
