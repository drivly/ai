import { getModel, ModelConfig } from 'ai-models'
import { env } from 'cloudflare:workers'
import { getModels, getRequiredCapabilities } from '../llm/model'
import { Provider } from './provider'

export const openRouter: Provider = {
  fetchFromProvider: (
    {
      body,
      headers: { Authorization } = { Authorization: undefined },
    }: {
      body?: Record<string, any>
      headers?: { Authorization: string | undefined }
    },
    method: string,
    path: string,
  ) => {
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
    if (body) {
      try {
        const config: ModelConfig = {
          requiredCapabilities: getRequiredCapabilities(body),
          seed: body.seed,
        }
        if (body.models?.length) {
          if (body.model) {
            if (!body.models.includes(body.model)) {
              body.models.push(body.model)
            }
            delete body.model
          }
          body.models = getModels(body.models, config)
        } else {
          body.model = getModel(body.model || fallbackModel, config)?.slug
        }
      } catch (error) {
        console.error(error)
      }
      if (body.models && !body.models.length) {
        delete body.models
      }
    }

    return fetch(`https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/openrouter/v1${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
      body: JSON.stringify(body),
    })
  },
}
