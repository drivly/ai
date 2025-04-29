import { API } from '@/lib/api'
import { generateOpenApiSpec } from '@/lib/api-schema'
import { NextResponse } from 'next/server'

/**
 * Return the OpenAPI specification
 * Note: This route is now primarily for development purposes.
 * In production, the schema is pre-generated at build time.
 */
export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
  const spec = generateOpenApiSpec(payload)

  const response = NextResponse.json(spec)

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

  return response
})
