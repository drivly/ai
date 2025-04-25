import { generateText as aiGenerateText, streamText as aiStreamText, Tool, type ToolSet, type LanguageModelV1, jsonSchema } from 'ai'
import { model } from './provider'
import { VercelAIToolSet, Composio } from 'composio-core'

const camelCaseToScreamingSnakeCase = (str: string) => {
  // When we see a capital letter, we need to prefix it with an underscore and make the whole string uppercase.
  return str
    .replaceAll('.', '_')
    .replace(/([A-Z])/g, '_$1').toUpperCase()
}

type GenerateTextOptions = Omit<Parameters<typeof aiGenerateText>[0], 'model'> & {
  model: (string & {}) | LanguageModelV1
  user?: string
}

// Generates a config object from 
export async function resolveConfig(options: GenerateTextOptions) {
  // If options.model is a string, use our llm provider.
  if (typeof options.model === 'string') {
    options.model = model(options.model)
  }

  // @ts-expect-error - This is out of spec for LanguageModelV1, but we need to know if this is the LLMProvider
  const isLLMProvider = options.model?._name === 'LLMProvider'

  // @ts-expect-error - We know this property exists, but TS doesnt
  const parsedModel = options.model?.resolvedModel
  
  if (parsedModel.parsed?.tools && Object.keys(parsedModel.parsed.tools).length > 0) {
    if (!options.user) {
      throw new Error('user is required when using tools')
    }

    const toolNames = Object.keys(parsedModel.parsed.tools)

    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY })
    const connections = await composio.connectedAccounts.list({
      user_uuid: options.user
    })

    const composioToolset = new VercelAIToolSet({
      apiKey: process.env.COMPOSIO_API_KEY,
      connectedAccountIds: connections.items
        .map(connection => [connection.appName, connection.id])
        .reduce((acc, [app, id]) => ({ ...acc, [app]: id }), {})
    })

    const apps = toolNames.map(name => name.split('.')[0])

    const tools = await composioToolset.getTools({
      apps,
      actions: toolNames.map(name => camelCaseToScreamingSnakeCase(name)),
    })

    options.tools = options.tools ?? {}
    options.tools = { ...options.tools, ...tools }

    if (parsedModel.provider?.slug === 'openAi') {
      // We need to amend composio tools for OpenAI usage.
      for (const [name, tool] of Object.entries(tools)) {
        options.tools[name] = {
          ...tool,
          parameters: {
            ...tool.parameters,
            jsonSchema: {
              ...tool.parameters.jsonSchema,
              additionalProperties: false,
              strict: true
            },
          }
        }
      }
    }

    // Openrouter compatibility
    if (isLLMProvider) {
      if (options.model.provider === 'openrouter') {
        // Remove any "illegal" openai keys
        const illegalKeys = [
          'default',
          'minimum',
          'maximum'
        ]

        const recursiveUpdate = (obj: any) => {
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              if (typeof obj[i] === 'object' && obj[i] !== null) {
                recursiveUpdate(obj[i])
              }
            }
          } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
              if (illegalKeys.includes(key)) {
                delete obj[key]
              } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                recursiveUpdate(obj[key])
              }
            }
          }
        }

        // Apply the recursiveUpdate to all tools
        for (const toolName in options.tools) {
          recursiveUpdate(options.tools[toolName])
        }
      }
    }
  }

  return options
}

async function generateText(options: GenerateTextOptions) {
  const resolvedOptions = await resolveConfig(options)
  return aiGenerateText(resolvedOptions as Parameters<typeof aiGenerateText>[0])
}

async function streamText(options: GenerateTextOptions) {
  const resolvedOptions = await resolveConfig(options)
  return aiStreamText(resolvedOptions as Parameters<typeof aiStreamText>[0])
}

export { generateText, streamText }
