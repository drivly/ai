import * as Sentry from '@sentry/node'

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1,
    debug: process.env.NODE_ENV !== 'production',
  })
}
