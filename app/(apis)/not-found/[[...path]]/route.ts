import { API } from '@/lib/api'
import { NextRequest } from 'next/server.js'

/**
 * Catch-all route handler for API endpoints that don't match existing routes
 * Returns a properly formatted JSON 404 response
 */
export const GET = API(async (request: NextRequest, { params }) => {
  if (request.nextUrl.pathname === '/') {
    return { notFound: true }
  }

  const path = request.nextUrl.pathname

  return {
    error: true,
    message: `API route not found: ${path}`,
    statusCode: 404,
  }
})

export const POST = GET
export const PUT = GET
export const DELETE = GET
export const PATCH = GET
export const OPTIONS = GET
export const HEAD = GET
