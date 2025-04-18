import { API } from '@/lib/api'
import fs from 'fs/promises'
import path from 'path'

let staticIntegrations: { apps: any[] } = { apps: [] }

try {
  staticIntegrations = require('../../../public/data/integrations.json')
} catch (error) {
  console.warn('Static integrations data not found, will be empty until seed script is run')
}

export const GET = API(async (request, { params: { integration }, origin, url }) => {
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return new Response('Composio API key not configured', { status: 500 })
  }

  const integrationApp = staticIntegrations.apps?.find(app => app.key === integration)
  if (!integrationApp) {
    return new Response(`Integration '${integration}' not found`, { status: 404 })
  }

  const response = await fetch(`https://backend.composio.dev/api/v1/apps/${integration}`, {
    headers: {
      'x-api-key': apiKey,
    },
  })

  const links = {
    home: origin,
    back: origin,
    self: url.toString(),
  }

  const data = await response.json()
  return { links, integration: data }
})
