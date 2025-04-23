import { ApiContext, ApiHandler, ApiRequest } from './types'
import { createPayloadClient } from './createPayloadClient'

/**
 * Create an API handler with Payload CMS context
 * @param getPayload - Function to get Payload CMS instance
 * @param configPromise - Payload config promise
 * @param handler - The API handler function
 * @returns Handler function compatible with different environments
 */
export const createApiHandler = <T = any>(getPayload: (options: any) => Promise<any>, configPromise: any, handler: ApiHandler<T>) => {
  return async (request: ApiRequest, params: Record<string, string | string[]>) => {
    try {
      // Get Payload instance
      const payload = await getPayload({
        config: configPromise,
      })

      // Get auth info
      const auth = await payload.auth(request)
      const { permissions } = auth
      const user =
        auth.user?.collection === 'users'
          ? {
              email: auth.user.email,
            }
          : {
              app: auth.user?.name,
              appId: auth.user?.id,
            }

      // Parse URL and path info
      const url = new URL(request.url)
      const path = url.pathname
      const domain = url.hostname
      const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')

      // Create a db proxy object for more concise collection operations
      const db = createPayloadClient(payload)

      // Prepare enhanced context
      const ctx: ApiContext = {
        params,
        url,
        path,
        domain,
        origin,
        user,
        permissions,
        payload,
        db,
      }

      // Call the handler with enhanced context
      return await handler(request, ctx)
    } catch (error) {
      console.error('API Error:', error)

      // Return error details
      const status = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500
      return {
        error: {
          message: error instanceof Error ? error.message : 'Internal Server Error',
          status,
          ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack?.split('\n') : undefined }),
        }
      }
    }
  }
}
