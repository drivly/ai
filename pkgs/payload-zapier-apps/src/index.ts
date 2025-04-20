import path from 'path'
import { fileURLToPath } from 'url'
import { ZapierCollectionConfig } from './types/collection'

export interface ZapierGeneratorOptions {
  /**
   * Path to the collections module
   * Default: ../../../collections/index.js (relative to this package)
   */
  collectionsPath?: string

  /**
   * Directory where Zapier apps will be generated
   * Default: ./apps (relative to this package)
   */
  outputDir?: string
}

/**
 * Generate Zapier integration apps for Payload CMS collections
 * @param options Configuration options for the generator
 * @returns Promise that resolves when generation is complete
 */
export async function generateZapierApps(options: ZapierGeneratorOptions = {}): Promise<void> {
  const { main } = await import('./generate.js')
  await main(options)
}

export * from './types/collection'
