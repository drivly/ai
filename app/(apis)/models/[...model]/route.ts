import { API } from '@/lib/api'
import { Capability, getModel, ParsedModelIdentifier, reconstructModelString, models, parse } from '@/pkgs/ai-models'
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

  const originOrApiRoute = !origin.includes('models.do') ? `${origin}/models` : origin

  const modifyQueryString = (param: string, value: string | number | boolean) => {
    const qs = new URLSearchParams(request.url.split('?')[1])
    qs.set(param, value.toString())
    return `${originOrApiRoute}?${qs.toString()}`
  }

  const qs = new URLSearchParams(request.url.split('?')[1])

  const modelName = Array.isArray(params.model) ? params.model.join('/') : params.model

  try {
    const model = getModel(modelName)

    if (!model) {
      return {
        error: 'Model not found',
      }
    }

    const generateLinks = (param: string, options: any[]) => {
      const links = options
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
            [option]: `${originOrApiRoute}/${reconstructModelString(modifiedParsedObject)}?${qs.toString()}`,
          }
        })
        .reduce<Record<string, string>>((acc, curr) => ({ ...acc, ...curr }), {})

      if (Object.keys(links).length === 1) {
        return Object.values(links)[0]
      }

      return links
    }

    const applyPreset = (preset: Record<string, any>) => {
      const modifiedParsedObject = {
        ...(model?.parsed as ParsedModelIdentifier),
      }

      modifiedParsedObject.systemConfig = {
        ...(model?.parsed as ParsedModelIdentifier).systemConfig,
        ...preset,
      }

      return `${originOrApiRoute}/${reconstructModelString(modifiedParsedObject)}?${qs.toString()}`
    }

    const modelNameTemp = reconstructModelString(model?.parsed as ParsedModelIdentifier)
    const capabilities = ['reasoning', 'tools', 'code', 'online']

    const isGateway = !origin.includes('models.do')

    const seed = Number(model?.parsed.systemConfig?.seed) || 0
    const temperature = model?.parsed.systemConfig?.temperature || 0.5
    const topP = model?.parsed.systemConfig?.topP || 1
    const topK = model?.parsed.systemConfig?.topK || 1

    const allSupportedCapabilities = model?.model?.capabilities
    const activeCapabilities = model?.parsed.capabilities

    const modelNameWithoutSettings = modelNameTemp.split('/')[0].split(':')[0].split('(')[0]

    if (qs.has('models')) {
      let groupModels = qs.get('models')?.split(',')
      if (groupModels) {
        groupModels = groupModels.filter((model) => model.split('/')[0].split(':')[0].split('(')[0] !== modelNameWithoutSettings)

        groupModels.push(modelNameTemp)

        qs.set('models', groupModels.join(','))
      }
    }

    return {
      links: {
        toLLM: `https://llm.do/chat?model=${modelNameTemp.includes('/') ? modelNameTemp.split('/')[1] : modelNameTemp}`,
        toModels: `${originOrApiRoute}?${qs.toString()}`,
        presets: {
          creative: applyPreset(PRESETS.creative),
          balanced: applyPreset(PRESETS.balanced),
        },
        seed: {
          current: seed,
          increment: generateLinks('seed', [seed + 1]),
          decrement: seed > 0 ? generateLinks('seed', [seed - 1]) : undefined,
        },
        temperature: {
          current: temperature,
          'Set to 0': generateLinks('temperature', [0]),
          'Set to 0.2': generateLinks('temperature', [0.2]),
          'Set to 0.4': generateLinks('temperature', [0.4]),
          'Set to 0.6': generateLinks('temperature', [0.6]),
          'Set to 0.8': generateLinks('temperature', [0.8]),
          'Set to 1': generateLinks('temperature', [1]),
          'Set to 1.2': generateLinks('temperature', [1.2]),
          'Set to 2': generateLinks('temperature', [2]),
        },
        topP: {
          current: topP,
          'Set to 0': generateLinks('topP', [0]),
          'Set to 0.2': generateLinks('topP', [0.2]),
          'Set to 0.4': generateLinks('topP', [0.4]),
          'Set to 0.6': generateLinks('topP', [0.6]),
          'Set to 0.8': generateLinks('topP', [0.8]),
          'Set to 1': generateLinks('topP', [1]),
        },
        capabilities: allSupportedCapabilities
          ?.map((capability) => {
            return {
              current: activeCapabilities.join(', '),
              [capability]: generateLinks('capabilities', [capability]),
            }
          })
          .filter(Boolean)
          .reduce<Record<string, any>>((acc, curr) => ({ ...acc, ...curr }), {}),
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
