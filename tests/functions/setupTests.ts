import { beforeEach } from 'vitest'
import { TestEnvConfig } from './common/types'

/**
 * Set up the test environment with required environment variables
 */
export function setupTestEnvironment(config: TestEnvConfig = {}) {
  if (!process.env.AI_GATEWAY_URL) {
    process.env.AI_GATEWAY_URL = config.AI_GATEWAY_URL || 'https://llm.do'
  }
  
  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      process.env[key] = value
    }
  })
}


beforeEach(() => {
  setupTestEnvironment()
})
