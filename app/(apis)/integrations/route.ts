import { API } from '@/api.config'
import { NextRequest } from 'next/server'

export const GET = API(async (request: NextRequest, { db, user, url }) => {
  if (!process.env.COMPOSIO_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  // Pull the available apps from Composio
  const response = await fetch('https://backend.composio.dev/api/v1/apps', {
    headers: { 'x-api-key': process.env.COMPOSIO_API_KEY },
  })

  const data = await response.json()

  const integrations: Record<string, string> = {}
  const { origin, pathname } = url
  data.items?.map((app: any) => (integrations[app.name] = `${origin}${pathname}/${app.key}`))

  return { integrations }
})

export const POST = API(async (request: NextRequest, { db, user, url }) => {
  if (!process.env.COMPOSIO_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  const body = await request.json()

  const response = await fetch('https://backend.composio.dev/api/v1/apps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.COMPOSIO_API_KEY,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return Response.json(data)
})

export const PUT = API(async (request: NextRequest, { db, user, url }) => {
  if (!process.env.COMPOSIO_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  const body = await request.json()

  const response = await fetch('https://backend.composio.dev/api/v1/apps', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.COMPOSIO_API_KEY,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return Response.json(data)
})

export const DELETE = API(async (request: NextRequest, { db, user, url }) => {
  if (!process.env.COMPOSIO_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  const response = await fetch('https://backend.composio.dev/api/v1/apps', {
    method: 'DELETE',
    headers: {
      'x-api-key': process.env.COMPOSIO_API_KEY,
    },
  })

  const data = await response.json()
  return Response.json(data)
})
