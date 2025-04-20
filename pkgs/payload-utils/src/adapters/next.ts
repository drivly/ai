import { NextRequest, NextResponse } from 'next/server.js'
import { ApiHandler } from '../types'
import { createApiHandler } from '../createApiHandler'

/**
 * Creates an API handler compatible with NextJS
 * @param getPayload - Function to get Payload CMS instance
 * @param configPromise - Payload config promise
 * @param handler - The API handler function
 * @returns NextJS-compatible handler
 */
export const createNextApiHandler = <T = any>(getPayload: (options: any) => Promise<any>, configPromise: any, handler: ApiHandler<T>) => {
  const apiHandler = createApiHandler(getPayload, configPromise, handler)

  return async (req: NextRequest, context: { params: Promise<Record<string, string | string[]>> }) => {
    const params = await context.params
    const result = await apiHandler(req, params)

    return NextResponse.json(
      {
        api: {
          name: new URL(req.url).hostname,
          description: 'Economically valuable work delivered through simple APIs',
          url: req.url,
          home: new URL(req.url).origin,
          login: new URL(req.url).origin + '/login',
          signup: new URL(req.url).origin + '/signup',
          admin: new URL(req.url).origin + '/admin',
          docs: new URL(req.url).origin + '/docs',
          with: 'https://apis.do',
          from: 'https://agi.do',
        },
        ...result,
        user: {},
      },
      { headers: { 'content-type': 'application/json; charset=utf-8' } },
    )
  }
}
