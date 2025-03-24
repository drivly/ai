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