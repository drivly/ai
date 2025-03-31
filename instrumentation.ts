import * as Sentry from '@sentry/nextjs'

export function register() {
  if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      debug: process.env.NODE_ENV !== 'production',
      enabled: process.env.NEXT_PHASE !== 'phase-production-build',
    })
  }
}

export function onRequestError({ 
  error, 
  request, 
  context 
}: { 
  error: Error; 
  request: Request; 
  context?: unknown;
}) {
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    Sentry.captureException(error, {
      extra: { request, context }
    })
  }
}
