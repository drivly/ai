import { API } from 'clickable-apis'
import { Capability, getModel, ParsedModelIdentifier, reconstructModelString } from '@/pkgs/ai-models/src'
import { models } from '@/pkgs/ai-models/src/providers'
import { parse } from '@/pkgs/ai-models/src/parser'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const openrouter = createOpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

const SAMPLE_PROMPT = `Which is higher, 9.9 or 9.11?`

const PRESETS = {
  creative: {
    temperature: 1,
    maxTokens: 1000,
    topP: 1,
  },
  balanced: {
    temperature: 0.5,
    maxTokens: 1000,
    topP: 1,
  },
}

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  const originOrApiRoute = origin.includes('localhost') ? `${origin}/api/models` : origin

  const modifyQueryString = (param: string, value: string | number | boolean) => {
    const qs = new URLSearchParams(request.url.split('?')[1])
    qs.set(param, value.toString())
    return `${originOrApiRoute}?${qs.toString()}`
  }

  const modelName = Array.isArray(params.model) ? params.model.join('/') : params.model

  try {
    const model = getModel(modelName)

    if (!model) {
      return {
        error: 'Model not found',
      }
    }

    const generateLinks = (param: string, options: any[]) => {
      return options
        .map((option) => {
          const modifiedParsedObject = structuredClone({
            ...(model?.parsed as ParsedModelIdentifier),
          })

          if (param === 'capabilities') {
            // If the option already exists, remove it, else add it.
            if (modifiedParsedObject.capabilities.includes(option)) {
              modifiedParsedObject.capabilities = modifiedParsedObject.capabilities.filter((capability) => capability !== option)
            } else {
              modifiedParsedObject.capabilities.push(option)
            }
          }

          // If the param is seed, temperature, or maxTokens, we need to add it to the systemConfig
          if (param === 'seed' || param === 'temperature' || param === 'maxTokens') {
            modifiedParsedObject.systemConfig = {
              ...(model?.parsed as ParsedModelIdentifier).systemConfig,
              [param]: option,
            }
          }

          return {
            [option]: `${originOrApiRoute}/${reconstructModelString(modifiedParsedObject)}`.replaceAll('(', '%28').replaceAll(')', '%29'),
          }
        })
        .reduce<Record<string, string>>((acc, curr) => ({ ...acc, ...curr }), {})
    }

    const applyPreset = (preset: Record<string, any>) => {
      const modifiedParsedObject = {
        ...(model?.parsed as ParsedModelIdentifier),
      }

      modifiedParsedObject.systemConfig = {
        ...(model?.parsed as ParsedModelIdentifier).systemConfig,
        ...preset,
      }

      return `${originOrApiRoute}/${reconstructModelString(modifiedParsedObject)}`
    }

    const modelNameTemp = reconstructModelString(model?.parsed as ParsedModelIdentifier) 
    const capabilities = ['reasoning', 'tools', 'code', 'online']

    const isGateway = !origin.includes('models.do')
    
    return {
      links: {
        toFunctions: `${ isGateway ? `${origin}/functions` : `functions.do` }?model=${modelNameTemp.includes('/') ? modelNameTemp.split('/')[1] : modelNameTemp}`,
        seed: generateLinks('seed', [
          1,
          2,
          3,
          // Bounded random (from 10-100) with at least 5 iterations
          ...Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10),
        ]),
        temperature: generateLinks('temperature', [0, 0.25, 0.5, 0.75, 1, 1.5, 2]),
        capabilities: generateLinks('capabilities', capabilities),
        presets: {
          creative: applyPreset(PRESETS.creative),
          balanced: applyPreset(PRESETS.balanced),
        },
      },
      model,
    }
  } catch (error) {
    return {
      error: 'Model not found or has incompatible capabilities',
      // @ts-expect-error - Error is not typed
      errorMessage: error.message,
    }
  }
})
