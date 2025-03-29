import { type Capability, getModel } from 'ai-models'
import { env } from 'cloudflare:workers'
import type { ChatCompletionRequest } from 'types/chat'

export async function fetchFromProvider(
  {
    body,
    headers: { Authorization },
  }: {
    body?: { model?: string; models?: string[]; seed?: number } | ChatCompletionRequest
    headers: { Authorization: string | undefined }
  },
  method: string,
  path: string,
) {
  Authorization = Authorization?.startsWith('Bearer ') ? Authorization : `Bearer ${Authorization}`

  const fallbackModel = 'drivly/frontier'

  // Model router
  try {
    if (body?.models?.length) {
      if (body.model && !body.models.includes(body.model)) {
        body.models.push(body.model)
        delete body.model
      }
      body.models = body.models
        .map(
          (m) =>
            getModel(m, {
              requiredCapabilities: getRequiredCapabilities(body),
              seed: body.seed,
            })?.slug,
        )
        .filter((m) => m !== undefined)
      if (!body.models.length) {
        delete body.models
        body.model = fallbackModel
      }
    } else if (body) {
      body.model =
        getModel(body.model || '', {
          requiredCapabilities: getRequiredCapabilities(body),
          seed: body.seed,
        })?.slug || fallbackModel
    }
  } catch (error) {
    console.error(error)
    if (body) {
      body.model = fallbackModel
    }
  }

  return await fetch(`https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/openrouter/v1${path}`, {
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
  if (['low', 'medium', 'high'].includes(body.reasoning_effort)) {
    requiredCapabilities.push('reasoning', `reasoning-${body.reasoning_effort}` as any)
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
