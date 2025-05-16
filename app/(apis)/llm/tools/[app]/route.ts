import { API } from '@/lib/api'
import { Composio } from 'composio-core'
import { z, ZodError } from 'zod'

const composeZodSchema = (fields: any) => {
  const typeToZod: Record<string, z.ZodType> = {
    string: z.string(),
    number: z.number()
  }

  return z.object(
    Object.fromEntries(
      fields.map((field: any) => [field.name, typeToZod[field.type] || z.string()])
    )
  )
}

export const POST = API(async (request, { db, user, origin, url, domain, params }) => {
  const { app } = params

  const body = await request.json()

  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY })

  const loadApp = async () => {
    try {
      return await composio.apps.get({
        appKey: app as string
      })
    } catch (error) {
      return null
    }
  }

  const appMetadata = await loadApp()

  if (!appMetadata) {
    return {
      success: false,
      type: 'APP_NOT_FOUND',
      error: 'App not found',
      status: 404
    }
  }
  
  const auth = appMetadata.auth_schemes?.[0] || {}

  // We're only supporting API keys via this route.
  if (auth.mode !== 'API_KEY') {
    return {
      success: false,
      type: 'UNSUPPORTED_AUTH_SCHEME',
      error: 'Unsupported auth scheme',
      status: 400
    }
  }

  // Ensure all required fields are present.
  const fields = auth.fields

  const schema = composeZodSchema(fields)

  try {
    schema.parse(body)
  } catch (error) {
    return {
      success: false,
      type: 'INVALID_REQUEST_BODY',
      error: 'Invalid request body',
      issues: (error as ZodError).issues,
      status: 400
    }
  }

  const integration = await composio.integrations.getOrCreateIntegration({
    name: appMetadata.name,
    authScheme: 'API_KEY',
    appUniqueKey: appMetadata.name
  })

  // At this point, the body should match the schema thats being asked for.
  const result = await composio.connectedAccounts.initiate({
    integrationId: integration.id,
    authMode: 'API_KEY',
    entityId: user.email,
    connectionParams: body
  })

  return {
    success: true,
    message: 'Integration linked.',
  }
})