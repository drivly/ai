// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  })

  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
    
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`
    script.async = true
    document.head.appendChild(script)
  }
  
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    import('posthog-js').then((posthogModule) => {
      const posthog = posthogModule.default
      
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: '', // Use relative URL for proxy
        person_profiles: 'always',
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: true,
        },
      })
      
      if (typeof window !== 'undefined') {
        const handleRouteChange = () => {
          const url = window.location.href
          posthog.capture('$pageview', { $current_url: url })
        }
        
        handleRouteChange()
        
        window.addEventListener('popstate', handleRouteChange)
        
        const originalPushState = history.pushState
        history.pushState = function(...args) {
          originalPushState.apply(this, args)
          handleRouteChange()
        }
      }
    }).catch(err => {
      console.error('Error initializing PostHog:', err)
    })
  }
}
