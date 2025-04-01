import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClickhouseClient } from './index'
import { AnalyticsService } from './utils'

export async function analyticsMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
): Promise<NextResponse> {
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
        host: process.env.CLICKHOUSE_HOST || 'http://localhost',
        port: process.env.CLICKHOUSE_PORT ? parseInt(process.env.CLICKHOUSE_PORT) : 8123,
        username: process.env.CLICKHOUSE_USERNAME,
        password: process.env.CLICKHOUSE_PASSWORD,
        database: process.env.CLICKHOUSE_DATABASE || 'default',
      })
      
      const analyticsService = new AnalyticsService(clickhouseClient)
      
      await analyticsService.trackRequest({
        method,
        path: pathname,
        hostname,
        status: response.status,
        latency,
        userId,
        ip,
        userAgent,
        referer,
      })
      
      await clickhouseClient.close()
    } catch (error) {
      console.error('Error tracking analytics:', error)
    }
  }
  
  return response
}
