import {
  generateText as aiGenerateText,
  streamText as aiStreamText,
  jsonSchema,
  generateObject as aiGenerateObject,
  streamObject as aiStreamObject,
  tool,
  type Tool,
  type ToolSet,
  type LanguageModelV1,
} from 'ai'
import { model } from './provider'
import { VercelAIToolSet, Composio } from 'composio-core'
import TurndownService from 'turndown'
import {
  fetchWebsiteContents,
  worker,
  testTool
} from './tools'

// Google specific fixes
import { convertJSONSchemaToOpenAPISchema } from './providers/google'
import { alterSchemaForOpenAI } from './providers/openai'

const camelCaseToScreamingSnakeCase = (str: string) => {
  // When we see a capital letter, we need to prefix it with an underscore and make the whole string uppercase.
  return str
    .replaceAll('.', '_')
    .replace(/([A-Z])/g, '_$1').toUpperCase()
}

type GenerateTextOptions = Omit<Parameters<typeof aiGenerateText>[0], 'model'> & {
  model: (string & {}) | LanguageModelV1
  user?: string
  openrouterApiKey?: string
}

type GenerateObjectOptions = Omit<Parameters<typeof aiGenerateObject>[0], 'model'> & {
  model: (string & {}) | LanguageModelV1
  user?: string
  openrouterApiKey?: string
}

type StreamObjectOptions = Omit<Parameters<typeof aiStreamObject>[0], 'model'> & {
  model: (string & {}) | LanguageModelV1
  user?: string
  openrouterApiKey?: string
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

    if (parsedModel?.parsed?.tools?.fetch) {
      options.tools.fetchWebsiteContents = fetchWebsiteContents as Tool
    }

    if (parsedModel?.parsed?.tools?.testTool) {
      options.tools.testTool = testTool as Tool
    }

    if (parsedModel?.parsed?.tools?.worker) {
      // Call itself with a prompt, with full access to the tools the parent has access to.
      options.tools.worker = worker(options) as Tool
    }

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
          },
          execute: async (args: any) => {
            console.log(
              `[TOOL:${name}]`,
              args
            )
            // @ts-expect-error - TS doesnt like us calling this function even though it exists.
            return tool.execute(args)
          }
        }
      }
    } else {
      for (const [name, tool] of Object.entries(tools)) {
        options.tools[name] = {
          ...tool,
          execute: async (args: any) => {
            console.log(
              `[TOOL:${name}]`,
              args
            )
            // @ts-expect-error - TS doesnt like us calling this function even though it exists.
            return tool.execute(args)
          }
        }
      }
    }

    // Apply model author specific fixes
    if (parsedModel.author == 'google') {

      // For each tool, we need to replace the jsonSchema with a google compatible one.
      for (const toolName in options.tools) {
        options.tools[toolName].parameters.jsonSchema = convertJSONSchemaToOpenAPISchema(options.tools[toolName].parameters.jsonSchema)
      }
    }

    if (parsedModel.author == 'openai') {

      // For each tool, we need to replace the jsonSchema with a google compatible one.
      for (const toolName in options.tools) {

        console.log(
          options.tools[toolName].parameters.jsonSchema
        )

        options.tools[toolName].parameters.jsonSchema = alterSchemaForOpenAI(options.tools[toolName].parameters.jsonSchema)
      }
    }

    // Openrouter compatibility
    if (isLLMProvider) {
      if (options.model.provider === 'openrouter') {
        // Remove any "illegal" openai keys
        const illegalKeys = [
          'default',
          'minimum',
          'maximum',
          'examples'
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

async function generateObject(options: GenerateObjectOptions) {
  const resolvedOptions = await resolveConfig(options)
  return aiGenerateObject(resolvedOptions as Parameters<typeof aiGenerateObject>[0])
}

async function streamObject(options: StreamObjectOptions) {
  const resolvedOptions = await resolveConfig(options)
  return aiStreamObject(resolvedOptions as Parameters<typeof aiStreamObject>[0])
}

export { generateText, streamText, generateObject, streamObject }
