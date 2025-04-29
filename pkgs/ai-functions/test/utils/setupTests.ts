export function setupTestEnvironment() {
  if (!process.env.AI_GATEWAY_URL) {
    process.env.AI_GATEWAY_URL = 'https://llm.do'
  }
}

export function hasRequiredEnvVars() {
  return !!process.env.AI_GATEWAY_TOKEN
}
