import { API } from '../../src/client.js'
import { CLI } from '../../src/cli.js'

/**
 * Generate a unique test name with timestamp and optional prefix
 */
export function generateTestName(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/**
 * Create test clients with provided API key
 */
export function createTestClients(apiKey: string, baseUrl = 'http://localhost:3000') {
  const api = new API({
    apiKey,
    baseUrl,
  })

  const cli = new CLI({
    apiKey,
    baseUrl,
  })

  return { api, cli }
}

/**
 * Clean up test resources created during tests
 */
export async function cleanupTestResources(api: API, collection: string, resources: string[]): Promise<void> {
  for (const id of resources) {
    try {
      await api.remove(collection, id)
      console.log(`Cleaned up ${collection} resource with ID: ${id}`)
    } catch (error) {
      console.warn(`Failed to clean up ${collection} resource with ID: ${id}:`, error)
    }
  }
}
