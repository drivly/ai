import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClickhouseClient } from './index'
import { AnalyticsService } from './utils'

export async function analyticsMiddleware(request: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  const startTime = Date.now()

  const response = await next()

  const endTime = Date.now()
  const latency = endTime - startTime

  if (process.env.NODE_ENV === 'production' || process.env.TRACK_ANALYTICS === 'true') {
    setTimeout(async () => {
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
          forceRecreate: process.env.CLICKHOUSE_FORCE_RECREATE === 'true'
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
            status: response.status
          },
          metadata: {
            userId,
            ip,
            userAgent,
            referer
          }
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

        const timeoutPromise = new Promise<void>((_, reject) => 
          setTimeout(() => reject(new Error('Analytics processing timeout after 5000ms')), 5000)
        );
        
        await Promise.race([
          Promise.all(promises).catch((error) => {
            console.error('Error sending analytics data:', error)
          }),
          timeoutPromise
        ]).catch(err => {
          console.error('Analytics processing timed out:', err)
        })

        await clickhouseClient.close().catch(err => {
          console.error('Error closing ClickHouse client:', err)
        })
      } catch (error) {
        console.error('Error tracking analytics:', error)
      }
    }, 0)
  }

  return response
}
