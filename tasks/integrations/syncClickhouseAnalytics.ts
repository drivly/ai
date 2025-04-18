import { TaskConfig } from 'payload'
import { createClickhouseClient } from '@/analytics/src'
import { createAnalyticsService } from '@/analytics/src/utils'

export const syncClickhouseAnalyticsHandler = async ({ payload, job }: { payload: any; job: { input?: any } }) => {
  const { input } = job
  const { startDate, endDate } = input || {}

  try {
    console.log('Starting Clickhouse analytics sync')

    const clickhouseClient = createClickhouseClient({
      url: process.env.CLICKHOUSE_URL || `${process.env.CLICKHOUSE_HOST || 'http://localhost'}:${process.env.CLICKHOUSE_PORT ? parseInt(process.env.CLICKHOUSE_PORT) : 8123}`,
      username: process.env.CLICKHOUSE_USERNAME,
      password: process.env.CLICKHOUSE_PASSWORD,
      database: process.env.CLICKHOUSE_DATABASE || 'default',
      forceRecreate: process.env.CLICKHOUSE_FORCE_RECREATE === 'true',
    })

    const analyticsService = createAnalyticsService(clickhouseClient)

    const eventsSyncStart = Date.now()
    const events = await payload.find({
      collection: 'events',
      where: {
        ...(startDate && { createdAt: { greater_than: startDate } }),
        ...(endDate && { createdAt: { less_than: endDate } }),
      },
      limit: 1000,
    })

    for (const event of events.docs) {
      try {
        await analyticsService.trackEvent({
          type: event.type,
          source: event.source,
          subjectId: event.subject?.id,
          data: event.data,
          metadata: event.metadata,
          actionId: event.action?.id,
          triggerId: event.trigger?.id,
          searchId: event.search?.id,
          functionId: event.function?.id,
          workflowId: event.workflow?.id,
          agentId: event.agent?.id,
        })
      } catch (error) {
        console.error(`Failed to track event ${event.id}:`, error)
      }
    }

    console.log(`Synced ${events.docs.length} events in ${Date.now() - eventsSyncStart}ms`)

    const generationsSyncStart = Date.now()
    const generations = await payload.find({
      collection: 'generations',
      where: {
        ...(startDate && { createdAt: { greater_than: startDate } }),
        ...(endDate && { createdAt: { less_than: endDate } }),
      },
      limit: 1000,
    })

    for (const generation of generations.docs) {
      try {
        await analyticsService.trackGeneration({
          actionId: generation.action?.id,
          settingsId: generation.settings?.id,
          request: generation.request,
          response: generation.response,
          error: generation.error,
          status: generation.status,
          duration: generation.duration,
          tokensInput: generation.request?.input_tokens || 0,
          tokensOutput: generation.response?.output_tokens || 0,
          cost: (generation.request?.input_tokens || 0) * 0.00001 + (generation.response?.output_tokens || 0) * 0.00002, // Example cost calculation
        })
      } catch (error) {
        console.error(`Failed to track generation ${generation.id}:`, error)
      }
    }

    console.log(`Synced ${generations.docs.length} generations in ${Date.now() - generationsSyncStart}ms`)

    await clickhouseClient.close()

    return {
      eventsCount: events.docs.length,
      generationsCount: generations.docs.length,
    }
  } catch (error) {
    console.error('Error syncing analytics with Clickhouse:', error)
    throw error
  }
}

export const syncClickhouseAnalyticsTask = {
  slug: 'syncClickhouseAnalytics',
  label: 'Sync Clickhouse Analytics',
  inputSchema: [
    { name: 'startDate', type: 'text' },
    { name: 'endDate', type: 'text' },
  ],
  outputSchema: [
    { name: 'eventsCount', type: 'number' },
    { name: 'generationsCount', type: 'number' },
  ],
  handler: syncClickhouseAnalyticsHandler,
} as unknown as TaskConfig
