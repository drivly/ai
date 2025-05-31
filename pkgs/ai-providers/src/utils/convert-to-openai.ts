import { createOpenAI } from "@ai-sdk/openai"

/*
* Tricks AI SDK into giving us the body in a format that we can use.
* The reason why we need to do this is because all getArgs functions are private,
* so we can't use them to get the body.
* 
* We need the body to send to OpenRouter but I didnt want to have to do all of the same work that the OpenAI provider does.
* This is 100% a hack, but it works, and has virtually no performance impact.
*/
export const convertToOpenAI = async (modelSlug: string, modelConfigMixin: Record<string, any>, options: any) => {
  let bodyToSend: string | undefined = undefined

  const openAIProvider = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1/chat/completions?',
    apiKey: 'dummy-api-key',
    fetch: (_, openAIInit) => {
      bodyToSend = openAIInit?.body as string
      throw new Error('🚀')
    }
  })(modelSlug)

  try {
    return await openAIProvider.doStream(options)
  } catch (e) {}

  return JSON.parse(bodyToSend || '{}')
}