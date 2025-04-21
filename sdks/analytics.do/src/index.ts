import { API } from 'apis.do/src/client'
import type { AnalyticsConfig, BeforeSendEvent, TrackMetricOptions, ExperimentOptions, Experiment } from '../types'

/**
 * Default configuration for the analytics SDK
 * Provides sensible defaults for all settings
 */
const defaultConfig: AnalyticsConfig = {
  endpoint: '/_analytics',
  debug: process.env.NODE_ENV !== 'production',
  mode: 'auto',
}

/**
 * Queue for storing events when offline
 */
let offlineEventQueue: BeforeSendEvent[] = []

/**
 * API client for analytics.do
 */
const analyticsApi = new API({
  baseUrl: 'https://analytics.do/api',
})

/**
 * Initialize the analytics SDK with configuration
 * @param config - Configuration options for the analytics SDK
 * @returns Analytics client with track and trackPageView methods
 */
/**
 * Check if the browser is online
 */
function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

/**
 * Process offline events when coming back online
 */
function processOfflineEvents() {
  if (offlineEventQueue.length > 0 && isOnline()) {
    const events = [...offlineEventQueue]
    offlineEventQueue = []

    analyticsApi.post('/_analytics', { events }).catch(() => {
      offlineEventQueue.push(...events)
    })
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', processOfflineEvents)
}

export function initAnalytics(config: AnalyticsConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config }

  if (mergedConfig.debug) {
    console.debug('Analytics initialized with config:', mergedConfig)
  }

  return {
    /**
     * Track a custom event
     */
    track: async (eventName: string, properties: Record<string, any> = {}) => {
      try {
        const event: BeforeSendEvent = {
          name: eventName,
          properties,
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: Date.now(),
        }

        if (mergedConfig.beforeSend) {
          const processedEvent = mergedConfig.beforeSend(event)
          if (processedEvent === null) {
            if (mergedConfig.debug) {
              console.debug('Event skipped by beforeSend:', event)
            }
            return
          }
        }

        if (mergedConfig.handlers && mergedConfig.handlers[eventName]) {
          mergedConfig.handlers[eventName](event)
        }

        if (mergedConfig.debug) {
          console.debug('Tracking event:', event)
        }

        if (typeof window !== 'undefined' && !isOnline()) {
          offlineEventQueue.push(event)
          if (mergedConfig.debug) {
            console.debug('Device offline, queuing event for later', event)
          }
          return
        }

        await analyticsApi.post(mergedConfig.endpoint || '/_analytics', {
          events: [event],
        })
      } catch (error) {
        if (mergedConfig.debug) {
          console.error('Error tracking event:', error)
        }
      }
    },

    /**
     * Track a page view
     */
    trackPageView: async (url?: string) => {
      const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
      return await analyticsApi.post(mergedConfig.endpoint || '/_analytics', {
        events: [
          {
            name: 'pageview',
            url: pageUrl,
            timestamp: Date.now(),
          },
        ],
      })
    },
  }
}

/**
 * Track a metric with the analytics SDK
 * @param options - Options for tracking a metric
 * @returns Promise that resolves when the metric is tracked
 */
export async function trackMetric(options: TrackMetricOptions): Promise<void> {
  const { name, value, metadata = {} } = options

  const analytics = initAnalytics()
  await analytics.track('metric', {
    metricName: name,
    metricValue: value,
    metadata,
    timestamp: Date.now(),
  })
}

/**
 * Define an experiment
 */
export function defineExperiment(options: ExperimentOptions): Experiment {
  const { name, description, variants, metrics } = options

  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_')

  return {
    id,

    getVariant: (userId: string): string => {
      const hash = userId.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0)
      }, 0)

      return variants[hash % variants.length].id
    },

    trackMetric: async (options: TrackMetricOptions & { variant: string; userId: string }): Promise<void> => {
      const { name: metricName, value, variant, userId, metadata = {} } = options

      await trackMetric({
        name: metricName,
        value,
        metadata: {
          ...metadata,
          experimentId: id,
          variant,
          userId,
        },
      })
    },
  }
}

export const Analytics =
  typeof window !== 'undefined'
    ? ({ config = {} }: { config?: AnalyticsConfig }) => {
        const analytics = initAnalytics(config)

        analytics.trackPageView()

        return null
      }
    : () => null

export default initAnalytics()
