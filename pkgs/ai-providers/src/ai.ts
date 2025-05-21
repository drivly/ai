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
import { VercelAIToolSet, Composio, ConnectionRequest } from 'composio-core'
import TurndownService from 'turndown'
import {
  fetchWebsiteContents,
  worker,
  testTool,
  allTools
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

type ProvidersGenerateMixin = {
  model: (string & {}) | LanguageModelV1
  user?: string
  openrouterApiKey?: string
  modelOptions?: any
  /**
   * Report when a tool is called, used for analytics.
   * @param tool 
   * @param args 
   * @returns 
   */
  onTool?: (tool: string, args: any, result: any) => void
}

type GenerateTextOptions = Omit<Parameters<typeof aiGenerateText>[0], 'model'> & ProvidersGenerateMixin

type GenerateObjectOptions = Omit<Parameters<typeof aiGenerateObject>[0], 'model'> & ProvidersGenerateMixin

type StreamObjectOptions = Omit<Parameters<typeof aiStreamObject>[0], 'model'> & ProvidersGenerateMixin

type ConnectionType = 'OAUTH' | 'API_KEY'

export type AIToolAuthorizationError = Error & {
  type: 'AI_PROVIDERS_TOOLS_AUTHORIZATION'
  connectionRequests: {
    app: string
    icon: string
    description: string
    methods: {
      type: ConnectionType
      redirectUrl?: string
      fields?: Record<string, any>
    }[]
  }[]
  apps: string[]
}

// Generates a config object from 
export async function resolveConfig(options: GenerateTextOptions) {
  // If options.model is a string, use our llm provider.
  if (typeof options.model === 'string') {
    options.model = model(options.model, options.modelOptions || {})
  }

  // @ts-expect-error - This is out of spec for LanguageModelV1, but we need to know if this is the LLMProvider
  const isLLMProvider = options.model?._name === 'LLMProvider'

  // @ts-expect-error - We know this property exists, but TS doesnt
  const parsedModel = options.model?.resolvedModel
  
  const toolNames = Array.isArray(parsedModel.parsed.tools) ? parsedModel.parsed.tools : Object.keys(parsedModel.parsed.tools || {})

  if (parsedModel.parsed?.tools && toolNames.length > 0) {
    if (!options.user) {
      throw new Error('user is required when using tools')
    }

    options.tools = options.tools ?? {}

    if (toolNames.length > 0) {
      const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY })

      const connections = await composio.connectedAccounts.list({
        entityId: options.user,
        status: 'ACTIVE'
      })
  
      // Return a completion error if the user tries to use a app
      // that they have not yet connected. Inside this error, we will include a
      // redirect link to add the app.
  
      const activeApps = connections.items.map(connection => connection.appName)
      let missingApps: string[] = Array.from(new Set(toolNames.map((x: string) => x.split('.')[0]).filter((app: string) => !activeApps.includes(app))))

      const appMetadata = await Promise.all(missingApps.map(async app => {
        try {
          return await composio.apps.get({
            appKey: app as string
          })
        } catch (error) {
          return null
        }
      })).then(x => x.filter(x => x !== null))
      
      missingApps = missingApps
        // Remove any apps that are not in appMetadata.
        .filter(app => appMetadata.find(x => x.key === app))
        // Remove any apps that have no auth.
        .filter(app => !appMetadata.find(x => x.key === app)?.no_auth)
  
      if (missingApps.length > 0) {
        const connectionRequests: AIToolAuthorizationError['connectionRequests'] = []
  
        for (const app of missingApps) {
          const appData = appMetadata.find(x => x.key === app)

          const connectionRequest: AIToolAuthorizationError['connectionRequests'][0] = {
            app,
            icon: appData?.logo || '',
            description: appData?.description || '',
            methods: []
          }

          for (const authScheme of appData?.auth_schemes || []) {
            connectionRequest.methods.push({
              type: authScheme.mode as ConnectionType,
              redirectUrl: (authScheme.mode as string).includes('OAUTH') ? `/api/llm/tools/${app}/oauth?type=${authScheme.mode}` : undefined,
              fields: !(authScheme.mode as string).includes('OAUTH') ? authScheme.fields as Record<string, any> : undefined
            })
          }

          connectionRequests.push(connectionRequest)
        }
  
        const error = new Error(`Missing access to apps: ${missingApps.join(', ')}.`) as AIToolAuthorizationError  
  
        error.type = 'AI_PROVIDERS_TOOLS_AUTHORIZATION'
        error.connectionRequests = connectionRequests as AIToolAuthorizationError['connectionRequests']
        error.apps = missingApps
  
        throw error
      }
  
      const composioToolset = new VercelAIToolSet({
        apiKey: process.env.COMPOSIO_API_KEY,
        connectedAccountIds: connections.items
          .map(connection => [connection.appName, connection.id])
          .reduce((acc, [app, id]) => ({ ...acc, [app]: id }), {})
      })
  
      const apps = toolNames.map((name: string) => name.split('.')[0])
  
      const tools = await composioToolset.getTools({
        apps,
        actions: toolNames.map((name: string) => camelCaseToScreamingSnakeCase(name)),
      })
  
      
      options.tools = { ...options.tools, ...tools }
    }

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
      for (const [name, tool] of Object.entries(options.tools)) {

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
          execute: tool.execute ? async (args: any) => {
            console.log(
              `[TOOL:${name}]`,
              args
            )
            
            try {
              // @ts-expect-error - TS doesnt like us calling this function even though it exists.
              const result = await tool.execute(args)

              if (options.onTool) {
                options.onTool(name, args, {
                  success: true,
                  result
                })
              }
              
              return result
            } catch (error) {
              if (options.onTool) {
                options.onTool(name, args, {
                  success: false,
                  error: JSON.parse(JSON.stringify(error))
                })
              }
              throw error
            }
          } : undefined
        }
      }
    } else {
      for (const [name, tool] of Object.entries(options.tools)) {
        options.tools[name] = {
          ...tool,
          execute: tool.execute ? async (args: any) => {
            console.log(
              `[TOOL:${name}]`,
              args
            )

            try {
              // @ts-expect-error - TS doesnt like us calling this function even though it exists.
              const result = await tool.execute(args)

              if (options.onTool) {
                options.onTool(name, args, {
                  success: true,
                  result
                })
              }
              
              return result
            } catch (error) {
              if (options.onTool) {
                options.onTool(name, args, {
                  success: false,
                  error: JSON.parse(JSON.stringify(error))
                })
              }
              throw error
            }
          } : undefined
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
