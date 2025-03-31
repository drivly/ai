import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: 1,

  debug: process.env.NODE_ENV !== 'production',

  replaysOnErrorSampleRate: 1.0,

  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
