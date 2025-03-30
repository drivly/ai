import { type Capability, getModel } from 'ai-models'
import { env } from 'cloudflare:workers'

export function fetchFromProvider(
  {
    body,
    headers: { Authorization },
  }: {
    body?: Record<string, any>
    headers: { Authorization: string | undefined }
  },
  method: string,
  path: string,
) {
  Authorization = Authorization?.startsWith('Bearer ') ? Authorization : `Bearer ${Authorization}`

  const fallbackModel = 'drivly/frontier'

  if (body?.reasoning_effort) {
    body.reasoning = {
      ...(body.reasoning || {}),
      effort: body.reasoning_effort,
    }
    delete body.reasoning_effort
  }

  // Model router
  try {
    if (body?.models?.length) {
      if (body.model && !body.models.includes(body.model)) {
        body.models.push(body.model)
        delete body.model
      }
      body.models = body.models
        .map(
          (m: any) =>
            getModel(m, {
              requiredCapabilities: getRequiredCapabilities(body),
              seed: body.seed,
            })?.slug,
        )
        .filter((m: any) => m !== undefined)
      if (!body.models.length) {
        delete body.models
        body.model = fallbackModel
      }
    } else if (body) {
      body.model = getModel(body.model || fallbackModel, {
        requiredCapabilities: getRequiredCapabilities(body),
        seed: body.seed,
      })?.slug
    }
  } catch (error) {
    console.error(error)
  }

  return fetch(`https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/openrouter/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
    body: JSON.stringify(body),
  })
}

function getRequiredCapabilities(body: any) {
  const requiredCapabilities: Capability[] = []
  if (body.tools?.find((t: any) => typeof t !== 'string' && typeof t.type === 'string' && t.type.startsWith('web_search'))) {
    requiredCapabilities.push('online')
  }
  if (body.reasoning?.effort) {
    requiredCapabilities.push('reasoning', `reasoning-${body.reasoning?.effort}` as any)
  }
  if (body.tools?.find((t: any) => typeof t === 'string' || t.type === 'function')) {
    requiredCapabilities.push('tools')
  }
  if (body.response_format?.type === 'json_schema') {
    requiredCapabilities.push('structuredOutput')
  } else if (body.response_format?.type === 'json_object') {
    requiredCapabilities.push('responseFormat')
  }
  return requiredCapabilities
}
