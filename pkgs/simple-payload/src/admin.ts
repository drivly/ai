import { NextRequest, NextResponse } from 'next/server'
import { RouteHandler, RouteHandlerOptions } from './types'
import { getPayload } from 'payload'

/**
 * Generates the admin UI HTML
 */
export const ADMIN_GET: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      const payload = await getPayload({ config })
      const url = new URL(req.url)
      
      if (url.pathname.startsWith('/_payload/')) {
        return new Response('Static asset not found', { status: 404 })
      }
      
      const collections = Object.keys(payload.collections || {})
      
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payload CMS Admin</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script>
              window.payloadConfig = ${JSON.stringify({
                collections,
                serverURL: url.origin,
              })};
            </script>
          </head>
          <body>
            <div id="payload-admin">
              <h1>Payload CMS Admin</h1>
              <p>Loading admin interface...</p>
              <script>
                window.location.href = '${url.origin}/admin';
              </script>
            </div>
          </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    } catch (error) {
      console.error('Error in admin route handler:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
