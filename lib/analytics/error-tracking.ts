import posthog from 'posthog-js'

/**
 * Capture an error in PostHog
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('error', {
      error_message: error.message,
      error_name: error.name,
      error_stack: error.stack,
      ...context,
    })
  }
}
