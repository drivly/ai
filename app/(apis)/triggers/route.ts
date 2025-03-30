import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Pull the available triggers from Composio
  const response = await fetch('https://backend.composio.dev/api/v1/triggers', {
    headers: {
      'x-api-key': apiKey,
    },
  })

  const data = await response.json()
  return { triggers: data.triggers || data }
})
