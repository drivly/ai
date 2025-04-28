export function setupTestEnvironment() {
  if (!process.env.AI_GATEWAY_URL) {
    process.env.AI_GATEWAY_URL = 'https://ai-gateway.drivly.dev'
  }
  
}

export function hasRequiredEnvVars() {
  return !!process.env.AI_GATEWAY_TOKEN
}
