
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  tracesSampleRate: 1,

  debug: process.env.NODE_ENV !== 'production',
})
