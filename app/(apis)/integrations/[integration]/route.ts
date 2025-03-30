import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url, params: { integration } }) => {
  // Check if API key is configured
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  // Pull the available apps from Composio
  const response = await fetch(`https://backend.composio.dev/api/v1/apps/${integration}`, {
    headers: {
      'x-api-key': apiKey,
    },
  })

  const links = {
    home: url.origin,
    back: url.toString().replace(`/${integration}`, ''),
    self: url.toString(),
  }

  const data = await response.json()
  return { links, integration: data }
})
