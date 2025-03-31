import * as Sentry from '@sentry/nextjs'

export function register() {
  if (typeof window === 'undefined') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      debug: process.env.NODE_ENV !== 'production',
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
  Sentry.captureException(error, {
    extra: { request, context }
  })
}
