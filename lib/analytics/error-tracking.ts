import posthog from 'posthog-js'

/**
 * Capture an error in PostHog
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('error', {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      ...context
    })
  }
}
