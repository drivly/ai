import { RouteHandler, RouteHandlerOptions } from './types'

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

      const url = new URL(req.url)
      
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payload CMS Admin</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="refresh" content="0;url=${url.origin}/admin">
          </head>
          <body>
            <p>Redirecting to admin...</p>
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
