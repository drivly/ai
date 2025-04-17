import { AIConfig as SDKAIConfig, StreamingAIConfig, AI_Instance, TaggedTemplateFunction, FunctionDefinition } from '@/sdks/functions.do/types'

import { CoreMessage } from 'ai';
import { streamText, streamObject } from 'ai'
import { z } from 'zod'
import { createOpenAI } from '@ai-sdk/openai' // Use createOpenAI for compatibility
import { openai } from '@ai-sdk/openai'

const getAIProvider = (modelName?: string) => {
  const providerName = modelName?.split(':')[0] || 'openai' // Default to openai
  const actualModelName = modelName?.includes(':') ? modelName.split(':')[1] : modelName || 'gpt-4o' // Default model

  if (providerName === 'openai') {
    const baseURL = process.env.AI_GATEWAY || undefined
    const apiKey = process.env.OPENAI_API_KEY || undefined // API key might be needed even with gateway depending on setup, or if gateway is bypassed

    if (baseURL) {
      return createOpenAI({ baseURL, apiKey })(actualModelName)
    } else {
      console.warn('AI_GATEWAY not set, using default OpenAI provider.')
      return createOpenAI({ apiKey })(actualModelName)
    }
  }
  throw new Error(`Unsupported AI provider: ${providerName}`)
}

import { executeFunction } from '@/tasks/ai/executeFunction'

type AIFunctionSettings = {
  _model?: string
  _temperature?: number
  _maxTokens?: number
  _topP?: number
  _topK?: number
}

type AIFunctionProperty = string | string[] | Record<string, string> | Record<string, string[]>
type AIFunction = Record<string, AIFunctionProperty> & { _format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' } // Add _format
type AIWorkflow = (args: any) => Promise<any> // TODO: Get this strongly typed with generics on ai and db

type AIConfig = AIFunctionSettings & {
  [key: string]: AIFunction | AIWorkflow
}

export const AI = (config: AIConfig) => {
  // AIConfig here is the internal lib/ai config type
  const defaultConfig = {
    // Extract defaults from config
    model: config._model || 'gpt-4o',
    temperature: config._temperature,
    maxTokens: config._maxTokens,
    topP: config._topP,
    topK: config._topK,
  }

  return new Proxy(
    {},
    {
      get: (target: any, functionName: string) => {
        if (typeof functionName === 'symbol' || functionName === 'then' || functionName === 'catch' || functionName === 'finally') {
          return undefined
        }

        if (config[functionName]) {
          const schemaDefinition = config[functionName] // This is AIFunction or AIWorkflow

          if (typeof schemaDefinition === 'function') {
            console.warn(`Streaming not supported for direct workflow functions like '${functionName}' in lib/ai.ts`)
            return (args: any, callTimeConfig?: SDKAIConfig) => {
              return schemaDefinition(args) // Execute workflow directly
            }
          }

          const schema = Object.fromEntries(Object.entries(schemaDefinition).filter(([key]) => !key.startsWith('_')))
          const initialSettings = Object.fromEntries(Object.entries(schemaDefinition).filter(([key]) => key.startsWith('_')))

          return (args: any, callTimeConfig?: SDKAIConfig | StreamingAIConfig): Promise<any> | AsyncIterable<any> => {
            const mergedSettings: SDKAIConfig | StreamingAIConfig = { ...defaultConfig, ...initialSettings, ...(callTimeConfig as any) };
            const format = (mergedSettings as any).format || (initialSettings as any)._format || (Object.keys(schema).length > 0 ? 'Object' : 'Text'); // Determine format

            const isStreaming = 'stream' in mergedSettings && mergedSettings.stream === true

            const settingsForSdk = mergedSettings as any
            const sdkConfig: Record<string, any> = {
              temperature: settingsForSdk.temperature,
              ...(settingsForSdk.system && { system: settingsForSdk.system }),
              ...(settingsForSdk.seed && { seed: settingsForSdk.seed }),
              ...(settingsForSdk.maxTokens && { maxTokens: settingsForSdk.maxTokens }),
              ...(settingsForSdk.topP && { topP: settingsForSdk.topP }),
              ...(settingsForSdk.topK && { topK: settingsForSdk.topK }),
              ...Object.fromEntries(
                Object.entries(settingsForSdk).filter(
                  ([key]) => !key.startsWith('_') && !['model', 'temperature', 'system', 'seed', 'schema', 'stream', 'maxTokens', 'topP', 'topK'].includes(key),
                ),
              ),
            }
            Object.keys(sdkConfig).forEach((key) => sdkConfig[key] === undefined && delete sdkConfig[key])

            if (isStreaming) {
              const model = getAIProvider(mergedSettings.model) // model is the LanguageModelV1 object
              const prompt = `Function: ${functionName}\nSchema: ${JSON.stringify(schema)}\nArgs: ${JSON.stringify(args)}`
              const streamingSdkConfig = { ...sdkConfig }

              if (format === 'TextArray') {
                const listPrompt = `${prompt}\n\nRespond ONLY with a numbered markdown list. Each item must be on a new line.`
                const { system, ...restTextArraySettings } = streamingSdkConfig;
                const textArrayPrompt = `${prompt}\n\nRespond ONLY with a numbered markdown list. Each item must be on a new line.`
                const textArrayMessages: CoreMessage[] = [
                   { role: 'system', content: `${system || ''}\nRespond ONLY with a numbered markdown list. Each item must be on a new line.` },
                   { role: 'user', content: prompt } // Use original prompt here, instruction is in system
                ];

                return (async function*() {
                  try {
                    const result = await streamText({ model, messages: textArrayMessages, ...restTextArraySettings });
                    let buffer = '';
                    const lineRegex = /^\s*\d+\.\s+(.*)/;
                    for await (const textChunk of result.textStream) {
                      buffer += textChunk;
                      let newlineIndex;
                      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                        const line = buffer.substring(0, newlineIndex);
                        buffer = buffer.substring(newlineIndex + 1);
                        const match = line.match(lineRegex);
                        if (match && match[1]) {
                          yield match[1].trim();
                        }
                      }
                    }
                    if (buffer.length > 0) {
                       const match = buffer.match(lineRegex);
                       if (match && match[1]) {
                         yield match[1].trim();
                       }
                    }
                  } catch (e) {
                     console.error(`Error streaming TextArray for ${functionName}:`, e);
                     yield { error: `Failed to stream TextArray for ${functionName}: ${e instanceof Error ? e.message : String(e)}` };
                  }
                })();
              }
              else if (format === 'ObjectArray' && Object.keys(schema).length > 0) {
                 try {
                   const itemSchema = z.object(
                     Object.entries(schema).reduce(
                       (acc, [key, value]) => {
                         if (typeof value === 'string') acc[key] = z.string().describe(value);
                         else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') acc[key] = z.array(z.string()).describe(value[0]);
                         else if (typeof value === 'number') acc[key] = z.number().describe(String(value));
                         else if (typeof value === 'boolean') acc[key] = z.boolean().describe(String(value));
                         else acc[key] = z.any().describe(JSON.stringify(value)); // Fallback
                         return acc;
                       },
                       {} as Record<string, z.ZodTypeAny>,
                     ),
                   );
                   const arraySchema = z.array(itemSchema);
                   const arrayPrompt = `${prompt}\n\nRespond ONLY with a JSON array of objects conforming to the item schema.`
                   const { system: objArraySystem, ...restObjectArraySettings } = streamingSdkConfig;
                   const objectArrayPrompt = `${prompt}\n\nRespond ONLY with a JSON array of objects conforming to the item schema.`
                   const objectArrayMessages: CoreMessage[] = [
                      { role: 'system', content: `${objArraySystem || ''}\nRespond ONLY with a JSON array of objects conforming to the item schema.` },
                      { role: 'user', content: prompt } // Use original prompt
                   ];

                   return (async function* () {
                     try {
                       const result = await streamObject({ model, messages: objectArrayMessages, schema: arraySchema, ...restObjectArraySettings });
                       for await (const partial of result.partialObjectStream) {
                         yield partial;
                       }
                     } catch (e) {
                        console.error(`Error streaming ObjectArray for ${functionName}:`, e);
                        yield { error: `Failed to stream ObjectArray for ${functionName}: ${e instanceof Error ? e.message : String(e)}` };
                     }
                   })();
                 } catch (e) {
                   console.error(`Error creating Zod schema for ObjectArray ${functionName}:`, e);
                   return (async function* () {
                     yield { error: `Failed to create schema for ObjectArray ${functionName}: ${e instanceof Error ? e.message : String(e)}` };
                   })();
                 }
              }
              else if (format === 'Object' && Object.keys(schema).length > 0) {
                try {
                  const zodSchema = z.object(
                    Object.entries(schema).reduce(
                      (acc, [key, value]) => {
                        if (typeof value === 'string') acc[key] = z.string().describe(value)
                        else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') acc[key] = z.array(z.string()).describe(value[0])
                        else if (typeof value === 'number') acc[key] = z.number().describe(String(value));
                        else if (typeof value === 'boolean') acc[key] = z.boolean().describe(String(value));
                        else acc[key] = z.any().describe(JSON.stringify(value))
                        return acc
                      },
                      {} as Record<string, z.ZodTypeAny>,
                    ),
                  )

                  return (async function* () {
                     try {
                        const result = await streamObject({ model, prompt, schema: zodSchema, ...streamingSdkConfig })
                        for await (const partial of result.partialObjectStream) {
                          yield partial
                        }
                     } catch (e) {
                        console.error(`Error streaming Object for ${functionName}:`, e);
                        yield { error: `Failed to stream Object for ${functionName}: ${e instanceof Error ? e.message : String(e)}` };
                     }
                  })()
                } catch (e) {
                  console.error(`Error creating Zod schema or streaming object for ${functionName}:`, e)
                  return (async function* () {
                    yield { error: `Failed to stream object for ${functionName}: ${e instanceof Error ? e.message : String(e)}` }
                  })()
                }
              }
              else {
                 return (async function* () {
                    try {
                       const result = await streamText({ model, prompt, ...streamingSdkConfig })
                       for await (const textChunk of result.textStream) {
                         yield textChunk
                       }
                    } catch (e) {
                       console.error(`Error streaming Text for ${functionName}:`, e);
                       yield { error: `Failed to stream Text for ${functionName}: ${e instanceof Error ? e.message : String(e)}` };
                    }
                 })()
              }
            } else {
              return executeFunction({ functionName, schema, settings: mergedSettings, args }).catch((error) => {
                console.error(`Error executing function ${functionName}:`, error)
                throw error
              })
            }
          }
        }
        console.error(`Function ${functionName} not found in AI config provided to lib/ai.ts AI factory`)
        throw new Error(`Function ${functionName} not found in AI config`)
      },
      apply: (target: any, thisArg: any, args: any[]) => {
        if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
          const [template, ...expressions] = args
          const prompt = String.raw({ raw: template }, ...expressions)

          return (callTimeConfig?: SDKAIConfig | StreamingAIConfig) => {
            const functionName = 'generateText' // Default function for template literals
            const schema = {} // No schema for template literals
            const mergedSettings: SDKAIConfig | StreamingAIConfig = { ...defaultConfig, ...(callTimeConfig as any) } // Merge defaults and call-time config
            const isStreaming = 'stream' in mergedSettings && mergedSettings.stream === true

            if (isStreaming) {
              const model = getAIProvider(mergedSettings.model) // model is LanguageModelV1 object
              const settingsForSdk = mergedSettings as any
              const streamingSdkConfig: Record<string, any> = {
                temperature: settingsForSdk.temperature,
                ...(settingsForSdk.system && { system: settingsForSdk.system }),
                ...(settingsForSdk.seed && { seed: settingsForSdk.seed }),
                ...(settingsForSdk.maxTokens && { maxTokens: settingsForSdk.maxTokens }),
                ...(settingsForSdk.topP && { topP: settingsForSdk.topP }),
                ...(settingsForSdk.topK && { topK: settingsForSdk.topK }),
                ...Object.fromEntries(
                  Object.entries(settingsForSdk).filter(
                    ([key]) => !key.startsWith('_') && !['model', 'temperature', 'system', 'seed', 'schema', 'stream', 'maxTokens', 'topP', 'topK'].includes(key),
                  ),
                ),
              }
              Object.keys(streamingSdkConfig).forEach((key) => streamingSdkConfig[key] === undefined && delete streamingSdkConfig[key])

              return (async function* () {
                const result = await streamText({ model, prompt, ...streamingSdkConfig })
                for await (const textChunk of result.textStream) {
                  yield textChunk
                }
              })()
            } else {
              return executeFunction({ functionName, schema, settings: mergedSettings, args: { prompt } }).catch((error) => {
                console.error(`Error executing template literal function ${functionName}:`, error)
                throw error
              })
            }
          }
        }
        throw new Error('AI proxy in lib/ai.ts apply handler only supports tagged template literals.')
      },
    },
  ) as AI_Instance // Cast to AI_Instance which includes call/template signatures
}
