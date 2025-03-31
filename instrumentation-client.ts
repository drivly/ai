import * as Sentry from '@sentry/nextjs'

export function register() {
  if (typeof window !== 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      debug: process.env.NODE_ENV !== 'production',
      enabled: process.env.NEXT_PHASE !== 'phase-production-build',
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    })
  }
}
