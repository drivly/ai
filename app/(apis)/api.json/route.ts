import { API } from '@/lib/api'
import { generateOpenApiSpec } from '@/lib/api-schema'

/**
 * Return the OpenAPI specification
 * Note: This route is now primarily for development purposes.
 * In production, the schema is pre-generated at build time.
 */
export const GET = API(async (request, { db, user, origin, url, domain, payload }) => {
  return generateOpenApiSpec(payload)
})
