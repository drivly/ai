import { API } from 'clickable-apis'

export const GET = API(async (request, { db, user, url }) => {
  // Pull the available apps from Composio
  const response = await fetch('https://backend.composio.dev/api/v1/apps', {
    headers: { 'x-api-key': process.env.COMPOSIO_API_KEY! },
  })

  const data = await response.json()

  const integrations: Record<string, string> = {}
  const { origin, pathname } = url
  data.items?.map((app: any) => (integrations[app.name] = `${origin}${pathname}/${app.key}`))

  return { integrations }
})
