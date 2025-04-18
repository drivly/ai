import { APICallError, generateObject, generateText, LoadAPIKeyError, Output, type CoreMessage, type Schema, type Tool } from 'ai'
import { JSONObject } from 'hono/utils/types'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  getRequiredCapabilities,
  isAnthropicMessagesModelId,
  isDeepSeekChatModelId,
  isGoogleGenerativeAIModelId,
  isOpenAIChatModelId,
  versionedOpenaiModelIdMap,
  type ModelId,
} from './model'
import { getModel, getModels } from 'language-models'
import { registry } from './registry'

export async function llm<T extends JSONObject = JSONObject>({
  model = 'drivly/frontier',
  models = [model],
  schema,
  tools,
  toolsUsed = [],
  maxSteps = 1,
  maxRetries = 2,
  messages = [],
  seed,
  system,
  toolsOnly = false,
}: {
  provider?: string
  maxSteps?: number
  maxRetries?: number
  messages?: CoreMessage[]
  model?: ModelId
  models?: ModelId[]
  schema?: z.ZodSchema<T> | Schema<T>
  seed?: number
  system?: string
  tools?: Record<string, Tool>
  toolsOnly?: boolean
  toolsUsed?: string[]
}) {
  if (system) {
    messages.unshift({
      role: 'system',
      content: system,
    })
  }

  const resolvedModels = getModels(model)

  try {
    console.log(resolvedModels)

    // const provider = isOpenAIChatModelId(resolvedModels[0])
    //   ? 'openai'
    //   : isGoogleGenerativeAIModelId(resolvedModels[0])
    //     ? 'google'
    //     : isAnthropicMessagesModelId(resolvedModels[0])
    //       ? 'anthropic'
    //       : isDeepSeekChatModelId(resolvedModels[0])
    //         ? 'deepseek'
    //         : 'openrouter'

    // @ts-ignore - TODO Fix language-models types in getModels
    const provider = resolvedModels[0].provider.slug
    const model = registry.languageModel(`${provider}/${resolvedModels[0].provider.providerModelId}` as any)

    let objectCall
    if (provider === 'openai' && versionedOpenaiModelIdMap[model.modelId] && !versionedOpenaiModelIdMap[model.modelId].tools) {
      if (toolsUsed?.length) {
        // TODO: retrofit
        toolsUsed = []
      }
      messages.push({
        role: 'user',
        content: `Format the response to this schema and only return the object:
${JSON.stringify(schema instanceof z.ZodType ? zodToJsonSchema(schema) : schema)}`,
      })
      const call = await generateText({
        maxSteps,
        maxRetries,
        messages,
        model,
        seed,
        experimental_continueSteps: true,
        tools,
        toolChoice: toolsOnly ? 'required' : 'auto',
        experimental_activeTools: toolsUsed,
      })
      objectCall = {
        ...call,
        experimental_output: JSON.parse(call.text.replaceAll(/^```(json)?\n|```\n?$/g, '')),
      }
    } else {
      if (schema) {
        objectCall = await generateText({
          maxSteps,
          maxRetries,
          experimental_continueSteps: maxSteps > 1,
          messages,
          model,
          experimental_output: Output.object({ schema }),
          seed,
          tools,
          toolChoice: toolsOnly ? 'required' : 'auto',
          experimental_activeTools: toolsUsed,
        })
      } else {
        objectCall = await generateObject({
          messages,
          maxRetries,
          model,
          seed,
          output: 'no-schema',
        })
      }
    }
    if ('experimental_output' in objectCall) {
      const { experimental_output: object, ...retval } = objectCall

      return {
        ...retval,
        object: object as T,
        messages,
      }
    }
    return {
      ...objectCall,
      object: objectCall.object as T,
      messages,
    }
  } catch (e) {
    console.error(e)
    throw e instanceof Error
      ? new Error(e.message, {
        cause: e instanceof APICallError ? 502 : e instanceof LoadAPIKeyError ? 503 : e,
      })
      : e
  }
}
