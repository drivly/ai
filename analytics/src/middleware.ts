import { type NextRequest, NextResponse, after } from 'next/server'
import { createClickhouseClient } from './index'
import { AnalyticsService } from './utils'

export async function analyticsMiddleware(request: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  const startTime = Date.now()

  const response = await next()

  const endTime = Date.now()
  const latency = endTime - startTime

  if (process.env.NODE_ENV === 'production' || process.env.TRACK_ANALYTICS === 'true') {
    try {
      const { method, url, headers } = request
      const parsedUrl = new URL(url)
      const { pathname, hostname } = parsedUrl

      const userAgent = headers.get('user-agent') || ''
      const referer = headers.get('referer') || ''
      const ip = headers.get('x-forwarded-for') || ''

      const userId = request.cookies.get('userId')?.value || headers.get('x-user-id') || ''

      const clickhouseClient = createClickhouseClient({
        url: process.env.CLICKHOUSE_URL || `${process.env.CLICKHOUSE_HOST || 'http://localhost'}:${process.env.CLICKHOUSE_PORT ? parseInt(process.env.CLICKHOUSE_PORT) : 8123}`,
        username: process.env.CLICKHOUSE_USERNAME,
        password: process.env.CLICKHOUSE_PASSWORD,
        database: process.env.CLICKHOUSE_DATABASE || 'default',
        forceRecreate: process.env.CLICKHOUSE_FORCE_RECREATE === 'true',
      })

      const analyticsService = new AnalyticsService(clickhouseClient)

      const requestData = {
        method,
        path: pathname,
        hostname,
        status: response.status,
        latency,
        userId,
        ip,
        userAgent,
        referer,
        headers: Object.fromEntries(headers),
        timestamp: Date.now(),
      }

      const promises = [analyticsService.trackRequest(requestData).catch((err) => console.error('Failed to track request:', err))]

      const eventData = {
        type: 'page_view',
        source: 'web',
        url: url,
        headers: Object.fromEntries(headers),
        query: Object.fromEntries(parsedUrl.searchParams),
        data: {
          path: pathname,
          method,
          status: response.status,
        },
        metadata: {
          userId,
          ip,
          userAgent,
          referer,
        },
      }

      promises.push(analyticsService.trackEvent(eventData).catch((err) => console.error('Failed to track event:', err)))

      if (process.env.PIPELINE_URL) {
        promises.push(
          fetch(process.env.PIPELINE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([requestData]), // Wrap in array as required
          })
            .then(() => {}) // Convert Promise<Response> to Promise<void>
            .catch((err) => console.error('Failed to send to pipeline:', err)),
        )
      }

      after(
        Promise.all(promises).catch((error) => {
          console.error('Error sending analytics data:', error)
        }),
      )

      after(clickhouseClient.close())
    } catch (error) {
      console.error('Error tracking analytics:', error)
    }
  }

  return response
}
