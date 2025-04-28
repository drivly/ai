import * as Sentry from '@sentry/nextjs'
import { validateEnvironment } from './lib/environment'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      validateEnvironment()
    } catch (error) {
      console.error('Environment validation failed:', error)
      Sentry.captureException(error)
    }

    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }

  if (typeof window !== 'undefined') {
    await import('./instrumentation-client').then(({ register }) => register()).catch((err) => console.error('Error loading client instrumentation:', err))
  }
}

export const onRequestError = async (err: Error, request: any, context: any) => {
  Sentry.captureRequestError(err, request, context)

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { getPostHogServer } = await import('./lib/posthog')
      const posthog = await getPostHogServer()

      let distinctId = null
      if (request.headers.cookie) {
        const cookieString = request.headers.cookie
        const postHogCookieMatch = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/)

        if (postHogCookieMatch && postHogCookieMatch[1]) {
          try {
            const decodedCookie = decodeURIComponent(postHogCookieMatch[1])
            const postHogData = JSON.parse(decodedCookie)
            distinctId = postHogData.distinct_id
          } catch (e) {
            console.error('Error parsing PostHog cookie:', e)
          }
        }
      }

      await posthog.captureException(err, distinctId || undefined)
    } catch (posthogError) {
      console.error('Error capturing exception in PostHog:', posthogError)
    }
  }
}
