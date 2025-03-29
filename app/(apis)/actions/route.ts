import { API } from '@/api.config'

export const GET = API(async (request, { db, user, url }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Pull the available actions from Composio
  const response = await fetch('https://backend.composio.dev/api/v2/actions/list/all', {
    headers: {
      'x-api-key': apiKey,
    },
  })

  const data = await response.json()
  return { actions: data.actions || data }
})
