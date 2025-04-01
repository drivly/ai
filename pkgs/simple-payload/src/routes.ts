import { NextRequest, NextResponse } from 'next/server'
import { RouteHandler, RouteHandlerOptions } from './types'
import { getPayload } from 'payload'

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
 * Creates a GET route handler for Payload CMS
 */
export const REST_GET: RouteHandler = (options = {}) => {
  return async (req: Request) => {
    try {
      const { config } = options
      if (!config) {
        return new Response('Payload config is required', { status: 500 })
      }

      const payload = await getPayload({ config })
      const url = new URL(req.url)
      const { collection, id } = parsePathParams(url.pathname)
      
      if (!collection) {
        return NextResponse.json({ collections: Object.keys(payload.collections) })
      }
      
      let result
      if (id) {
        result = await payload.findByID({
          collection,
          id,
        })
      } else {
        const queryParams: Record<string, any> = {}
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value
        })
        
        result = await payload.find({
          collection,
          ...queryParams,
        })
      }
      
      return NextResponse.json(result)
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

      const payload = await getPayload({ config })
      const url = new URL(req.url)
      const { collection } = parsePathParams(url.pathname)
      
      if (!collection) {
        return new Response('Collection is required', { status: 400 })
      }
      
      const body = await req.json()
      const result = await payload.create({
        collection,
        data: body,
      })
      
      return NextResponse.json(result)
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

      const payload = await getPayload({ config })
      const url = new URL(req.url)
      const { collection, id } = parsePathParams(url.pathname)
      
      if (!collection || !id) {
        return new Response('Collection and ID are required', { status: 400 })
      }
      
      const body = await req.json()
      const result = await payload.update({
        collection,
        id,
        data: body,
      })
      
      return NextResponse.json(result)
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

      const payload = await getPayload({ config })
      const url = new URL(req.url)
      const { collection, id } = parsePathParams(url.pathname)
      
      if (!collection || !id) {
        return new Response('Collection and ID are required', { status: 400 })
      }
      
      const body = await req.json()
      const result = await payload.update({
        collection,
        id,
        data: body,
      })
      
      return NextResponse.json(result)
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

      const payload = await getPayload({ config })
      const url = new URL(req.url)
      const { collection, id } = parsePathParams(url.pathname)
      
      if (!collection || !id) {
        return new Response('Collection and ID are required', { status: 400 })
      }
      
      const result = await payload.delete({
        collection,
        id,
      })
      
      return NextResponse.json(result)
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
