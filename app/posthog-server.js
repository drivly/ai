import { PostHog } from 'posthog-node'

let posthogClient = null

export async function getPostHogServer() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.POSTHOG_API_KEY,
      {
        host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
        flushAt: 1
      }
    )

    posthogClient.captureException = (error, distinctId) => {
      return posthogClient.capture({
        distinctId: distinctId || 'server',
        event: 'server_error',
        properties: {
          error_message: error.message,
          error_name: error.name,
          error_stack: error.stack,
          source: 'server'
        }
      })
    }
  }
  
  return posthogClient
}
