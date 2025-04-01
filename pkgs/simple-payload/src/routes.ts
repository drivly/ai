import { RouteHandler, RouteHandlerOptions } from './types'

/**
 * Parses the URL path to extract collection and ID
 */
const parsePathParams = (pathname: string) => {
  const segments = pathname.replace(/^\/api\//, '').split('/').filter(Boolean)
  return {
    collection: segments[0] || '',
    id: segments[1] || '',
    params: segments.slice(2),
  }
}

/**
 * Helper function to create JSON response
 */
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Creates a GET route handler for Payload CMS
 */
export const REST_GET: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      return new Response('GET handler not implemented', { status: 501 })
    } catch (error) {
      console.error('Error in GET route handler:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Creates a POST route handler for Payload CMS
 */
export const REST_POST: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      return new Response('POST handler not implemented', { status: 501 })
    } catch (error) {
      console.error('Error in POST route handler:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Creates a PATCH route handler for Payload CMS
 */
export const REST_PATCH: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      return new Response('PATCH handler not implemented', { status: 501 })
    } catch (error) {
      console.error('Error in PATCH route handler:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Creates a PUT route handler for Payload CMS
 */
export const REST_PUT: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      return new Response('PUT handler not implemented', { status: 501 })
    } catch (error) {
      console.error('Error in PUT route handler:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Creates a DELETE route handler for Payload CMS
 */
export const REST_DELETE: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      return new Response('DELETE handler not implemented', { status: 501 })
    } catch (error) {
      console.error('Error in DELETE route handler:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Creates an OPTIONS route handler for Payload CMS
 */
export const REST_OPTIONS: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}
