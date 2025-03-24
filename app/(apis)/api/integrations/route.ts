import { API } from 'clickable-apis'

export const GET = API(async (request, { db, user, url }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Pull the integrations from Composio
  const response = await fetch('https://backend.composio.dev/api/v1/integrations', {
    headers: {
      'x-api-key': apiKey,
    },
  })

  const data = await response.json()
  return { integrations: data.integrations || data }
})

export const POST = API(async (request, { db, user, url }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Get the request body
  const body = await request.json()

  // Create integration in Composio
  const response = await fetch('https://backend.composio.dev/api/v1/integrations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return data
})

export const PUT = API(async (request, { db, user, url }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Get the request body
  const body = await request.json()

  // Update integration in Composio
  const response = await fetch('https://backend.composio.dev/api/v1/integrations', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return data
})

export const DELETE = API(async (request, { db, user, url }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Delete integration in Composio
  const response = await fetch('https://backend.composio.dev/api/v1/integrations', {
    method: 'DELETE',
    headers: {
      'x-api-key': apiKey,
    },
  })

  const data = await response.json()
  return data
})