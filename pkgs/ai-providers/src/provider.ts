import { InvalidResponseDataError, LanguageModelV1, LanguageModelV2, SharedV2ProviderMetadata, LanguageModelV2CallWarning, LanguageModelV2FinishReason, LanguageModelV2StreamPart, LanguageModelV2Usage } from '@ai-sdk/provider'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { getModel, getModels, Model } from 'language-models'
import { OpenAICompatibleChatLanguageModel } from '@ai-sdk/openai-compatible'
import { jsonrepair } from 'jsonrepair'
import { convertToOpenAI } from './utils/convert-to-openai'
import { z } from 'zod'

import {
  combineHeaders,
  createEventSourceResponseHandler,
  createJsonErrorResponseHandler,
  createJsonResponseHandler,
  FetchFunction,
  generateId,
  isParsableJson,
  parseProviderOptions,
  ParseResult,
  postJsonToApi,
  ResponseHandler,
} from '@ai-sdk/provider-utils'
import { mapOpenAICompatibleFinishReason } from './utils/map-finish-reason'

// Not in use for the inital release.
const providerRegistry: Record<string, any> = {
  openrouter: createOpenAI({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_TOKEN,
    headers: {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do',
    },
  }),
  google: createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  }),
  anthropic: createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  }),
  cloudflare: createOpenAI({
    baseURL: `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID || '<account_id>'}/${process.env.CLOUDFLARE_PROJECT_NAME || '<project_name>'}/workersai`,
    apiKey: process.env.CLOUDFLARE_API_KEY || process.env.AI_GATEWAY_TOKEN,
  }),
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
}

type ProviderOptions = {
  /**
   * If true, our provider will try to fix the schema of an output
   * using gemini-2.0-lite, taking the output of the model and
   * rewriting it to match the schema.
   */
  allowFixingSchema?: boolean
  /**
   * Tools to be used by the model
   */
  tools?: Record<string, string | number | boolean | Record<string, unknown>>
  /**
   * Priorities for model selection
   */
  priorities?: string[]
  /**
   * Enable reasoning capability
   */
  reasoning?: boolean
  /**
   * Maximum price constraint
   */
  maxPrice?: number
  /**
   * OpenRouter API key
   * Uses this key if defined, otherwise uses the default key at env.OPENROUTER_API_KEY
   */
  apiKey?: string
}

type LLMProviderConfig = {
  baseURL?: string
  apiKey?: string
  headers?: Record<string, string>
}

export const createLLMProvider = (config: LLMProviderConfig) => (model: string, options?: ProviderOptions) => {
  const augments: Record<string, any> = {}

  if (options?.tools) augments.tools = options.tools
  if (options?.priorities) augments.priorities = options.priorities
  if (options?.reasoning) {
    augments.capabilities ??= {}
    augments.capabilities = { ...augments.capabilities, reasoning: true }
  }
  if (options?.maxPrice) augments.providerConstraints = [{ field: 'cost', value: options.maxPrice.toString(), type: 'lt' }]

  if (!config.apiKey) {
    // Use fallback if no api key is provided via the create config
    config.apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_TOKEN || ''
  }

  return new LLMProvider(model, options ?? {}, config)
}

export const model = createLLMProvider({})

/**
 * Returns an array of LLMProvider instances for the given model identifiers
 * @param modelIdentifiers Comma-separated string of model identifiers
 * @param options Provider options
 * @returns Array of LLMProvider instances
 */
export const models = (modelIdentifiers: string, options?: ProviderOptions) => {
  const modelInstances = getModels(modelIdentifiers)
  return modelInstances.map((model) => new LLMProvider(model.slug, options ?? {}))
}

class LLMProvider implements LanguageModelV2 {
  // For signalling to our ai.ts overwrites that this is the LLMProvider
  readonly _name: string = 'LLMProvider'
  readonly specificationVersion = 'v2'
  readonly resolvedModel: Model
  readonly apiKey: string
  readonly supportedUrls: Record<string, RegExp[]> = {}

  constructor(
    public modelId: string,
    public options: ProviderOptions,
    private config?: Record<string, any>,
  ) {
    this.modelId = modelId
    this.options = options ?? {}
    this.config = config ?? {}
    // @ts-expect-error - Type is wrong
    this.resolvedModel = getModel(modelId, options)

    this.apiKey = this.config?.apiKey

    if (!this.apiKey) {
      throw new Error(`AI Provider found no API key. Please either provide an apiKey in the createLLMProvider config, or set the OPENROUTER_API_KEY environment variable.`)
    }
  }

  get provider() {
    let provider = 'openrouter'

    return provider

    // // Access provider property which is added by getModel but not in the Model type
    // const providerSlug = this.resolvedModel.provider?.slug

    // switch (providerSlug) {
    //   case 'openAi':
    //     provider = 'openai'
    //     break
    //   case 'aiStudioNonThinking':
    //   case 'aiStudio':
    //   case 'google':
    //     provider = 'openrouter'
    //     break
    //   case 'anthropic':
    //     provider = 'anthropic'
    //     break
    //   case 'cloudflare':
    //     provider = 'cloudflare'
    //     break
    //   default:
    //     provider = 'openrouter'
    //     break
    // }

    // return provider
  }

  get supportsImageUrls() {
    // Depending on the model, we may or may not support image urls
    return this.resolvedModel.inputModalities?.includes('image')
  }

  // Fix Anthropic's default object generation mode.
  get defaultObjectGenerationMode() {
    // Access provider property which is added by getModel but not in the Model type
    if (this.resolvedModel.provider?.supportedParameters.includes('structured_outputs')) {
      return 'json'
    }

    return 'tool' // (this.resolvedModel as any).provider?.supportedParameters.includes('tools') ? 'tool' : 'json'
  }

  get supportsStructuredOutputs() {
    return this.resolvedModel.provider?.supportedParameters.includes('structured_outputs')
  }

  async doGenerate(options: Parameters<LanguageModelV2['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV2['doGenerate']>>> {
    // Access providerModelId which is added by getModel but not in the Model type
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug || this.modelId : (this.resolvedModel as any).provider?.providerModelId

    let modelConfigMixin = {}

    if (options.responseFormat?.type == 'json') {
      // Force Google and OpenAI to use structured outputs.
      if (this.provider == 'google' || this.provider == 'openai') {
        modelConfigMixin = {
          structuredOutputs: true,
        }
      }
    }

    console.log(`Sending request to ${modelSlug} with strategy:`, this.supportsStructuredOutputs ? 'structuredOutputs' : this.defaultObjectGenerationMode)

    const provider = createOpenAI({
      apiKey: this.apiKey,
      baseURL: `https://openrouter.ai/api/v1`,
      fetch: async (req: RequestInfo | URL, init: RequestInit | undefined) => {
        const targetProvider = this.resolvedModel.provider?.name

        let bodyString = init?.body as string

        const newBody = {
          ...JSON.parse(bodyString),
          provider: {
            only: [targetProvider],
          },
        }

        console.dir(
          newBody, { depth: null }
        )

        const data = await fetch(req, {
          ...init,
          body: JSON.stringify(newBody),
        })

        const response = await (data.clone()).json()

        // Theres a chance this could be a botched tool call.
        // Example: <tool_call>{"name": "jsonOutput", "arguments": {"article": {"title"
        // This is the Hermes tool call format, but that AI SDK doesnt support it.
        // Mostly used by providers that dont support native tool calls

        console.log('Response from provider:')
        console.dir(
          response, { depth: null }
        )

        if (response.choices[0].message.content.startsWith('<tool_call>')) {

          const parsedToolCall = JSON.parse(jsonrepair(response.choices[0].message.content.replace('<tool_call>', '').replace('</tool_call>', '')))

          const fixedResponse = {
            ...response,
            choices: [
              {
                ...response.choices[0],
                message: {
                  ...response.choices[0].message,
                  content: '',
                  tool_calls: [
                    {
                      index: 0,
                      id: `call_${response.choices[0].message.id}`,
                      type: 'tool',
                      function: {
                        name: parsedToolCall.name,
                        arguments: parsedToolCall.arguments
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
        return data
      }
    })(modelSlug, modelConfigMixin)

    // const provider = new OpenAICompatibleChatLanguageModel(modelSlug, {
    //   provider: 'llm-do-internal',
    //   url: ({ path }) => `https://openrouter.ai/api/v1${path}`,
    //   supportsStructuredOutputs: this.supportsStructuredOutputs,
    //   //defaultObjectGenerationMode: this.defaultObjectGenerationMode,
    //   includeUsage: true,
    //   headers: () => ({
    //     Authorization: `Bearer ${this.apiKey}`,
    //   }),
    //   fetch: ,
    // })

    return await provider.doGenerate(options as any)

    //return await providerRegistry[this.provider](modelSlug, modelConfigMixin).doGenerate(options)
  }

  async doStream(options: Parameters<LanguageModelV2['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV2['doStream']>>> {
    // Access providerModelId which is added by getModel but not in the Model type
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug : (this.resolvedModel as any).provider?.providerModelId

    let modelConfigMixin = {}

    if (options.responseFormat?.type == 'json') {
      // Force Google and OpenAI to use structured outputs.
      if (this.provider == 'google' || this.provider == 'openai') {
        modelConfigMixin = {
          structuredOutputs: true,
        }
      }
    }

    console.log(
      options
    )

    if (!this.config) {
      throw new Error('No config found')
    }

    const body = await convertToOpenAI(modelSlug, modelConfigMixin, options)

    const { responseHeaders, value: response } = await postJsonToApi({
      url: `https://openrouter.ai/api/v1/chat/completions`,
      headers: combineHeaders({
        'Authorization': `Bearer ${this.apiKey}`,
      }, options.headers),
      body,
      failedResponseHandler: createJsonErrorResponseHandler({
        errorSchema: z.object({
          error: z.object({
            message: z.string(),
        
            // The additional information below is handled loosely to support
            // OpenAI-compatible providers that have slightly different error
            // responses:
            type: z.string().nullish(),
            param: z.any().nullish(),
            code: z.union([z.string(), z.number()]).nullish(),
          }),
        }),
        errorToMessage: (error) => {
          return error.error.message
        }
      }),
      successfulResponseHandler: createEventSourceResponseHandler(
        z.any(),
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    })

    let finishReason: LanguageModelV2FinishReason = 'stop'
    let isFirstChunk = true
    let usage: {
      completionTokens: number | undefined;
      completionTokensDetails: {
        reasoningTokens: number | undefined;
        acceptedPredictionTokens: number | undefined;
        rejectedPredictionTokens: number | undefined;
      };
      promptTokens: number | undefined;
      promptTokensDetails: {
        cachedTokens: number | undefined;
      };
      totalTokens: number | undefined;
    } = {
      completionTokens: undefined,
      completionTokensDetails: {
        reasoningTokens: undefined,
        acceptedPredictionTokens: undefined,
        rejectedPredictionTokens: undefined,
      },
      promptTokens: undefined,
      promptTokensDetails: {
        cachedTokens: undefined,
      },
      totalTokens: undefined,
    }

    const warnings: LanguageModelV2CallWarning[] = []
    const metadataExtractor = {}

    const toolCalls: Array<{
      id: string;
      type: 'function';
      function: {
        name: string;
        arguments: string;
      };
      hasFinished: boolean;
    }> = []

    const providerOptionsName = 'llm-do'

    return {
      stream: response.pipeThrough(
        new TransformStream<
          any,
          LanguageModelV2StreamPart
        >({
          start(controller) {
            controller.enqueue({ type: 'stream-start', warnings });
          },
          transform(chunk, controller) {
            // handle failed chunk parsing / validation:
            if (!chunk.success) {
              finishReason = 'error';
              controller.enqueue({ type: 'error', error: chunk.error });
              return;
            }

            const value = chunk.value;

            //metadataExtractor?.processChunk(chunk.rawValue);

            // handle error chunks:
            if ('error' in value) {
              finishReason = 'error';
              controller.enqueue({ type: 'error', error: value.error.message });
              return;
            }

            if (isFirstChunk) {
              isFirstChunk = false;

              function getResponseMetadata({
                id,
                model,
                created,
              }: {
                id?: string | undefined | null;
                created?: number | undefined | null;
                model?: string | undefined | null;
              }) {
                return {
                  id: id ?? undefined,
                  modelId: model ?? undefined,
                  timestamp: created != null ? new Date(created * 1000) : undefined,
                };
              }

              controller.enqueue({
                type: 'response-metadata',
                ...getResponseMetadata(value),
              });
            }

            if (value.usage != null) {
              const {
                prompt_tokens,
                completion_tokens,
                total_tokens,
                prompt_tokens_details,
                completion_tokens_details,
              } = value.usage;

              usage.promptTokens = prompt_tokens ?? undefined;
              usage.completionTokens = completion_tokens ?? undefined;
              usage.totalTokens = total_tokens ?? undefined;
              if (completion_tokens_details?.reasoning_tokens != null) {
                usage.completionTokensDetails.reasoningTokens =
                  completion_tokens_details?.reasoning_tokens;
              }
              if (
                completion_tokens_details?.accepted_prediction_tokens != null
              ) {
                usage.completionTokensDetails.acceptedPredictionTokens =
                  completion_tokens_details?.accepted_prediction_tokens;
              }
              if (
                completion_tokens_details?.rejected_prediction_tokens != null
              ) {
                usage.completionTokensDetails.rejectedPredictionTokens =
                  completion_tokens_details?.rejected_prediction_tokens;
              }
              if (prompt_tokens_details?.cached_tokens != null) {
                usage.promptTokensDetails.cachedTokens =
                  prompt_tokens_details?.cached_tokens;
              }
            }

            const choice = value.choices[0]

            if (choice?.finish_reason != null) {
              finishReason = mapOpenAICompatibleFinishReason(
                choice.finish_reason,
              );
            }

            if (choice?.delta == null) {
              return;
            }

            const delta = choice.delta;

            // enqueue reasoning before text deltas:
            if (delta.reasoning != null) {
              controller.enqueue({
                type: 'reasoning',
                text: delta.reasoning,
              });
            }

            if (delta.content != null) {
              controller.enqueue({
                type: 'text',
                text: delta.content,
              });
            }

            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = toolCallDelta.index;

                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== 'function') {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`,
                    });
                  }

                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`,
                    });
                  }

                  if (toolCallDelta.function?.name == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`,
                    });
                  }

                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: 'function',
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: toolCallDelta.function.arguments ?? '',
                    },
                    hasFinished: false,
                  };

                  const toolCall = toolCalls[index];

                  if (
                    toolCall.function?.name != null &&
                    toolCall.function?.arguments != null
                  ) {
                    // send delta if the argument text has already started:
                    if (toolCall.function.arguments.length > 0) {
                      controller.enqueue({
                        type: 'tool-call-delta',
                        toolCallType: 'function',
                        toolCallId: toolCall.id,
                        toolName: toolCall.function.name,
                        argsTextDelta: toolCall.function.arguments,
                      });
                    }

                    // check if tool call is complete
                    // (some providers send the full tool call in one chunk):
                    if (isParsableJson(toolCall.function.arguments)) {
                      controller.enqueue({
                        type: 'tool-call',
                        toolCallType: 'function',
                        toolCallId: toolCall.id ?? generateId(),
                        toolName: toolCall.function.name,
                        args: toolCall.function.arguments,
                      });
                      toolCall.hasFinished = true;
                    }
                  }

                  continue;
                }

                // existing tool call, merge if not finished
                const toolCall = toolCalls[index];

                if (toolCall.hasFinished) {
                  continue;
                }

                if (toolCallDelta.function?.arguments != null) {
                  toolCall.function!.arguments +=
                    toolCallDelta.function?.arguments ?? '';
                }

                // send delta
                controller.enqueue({
                  type: 'tool-call-delta',
                  toolCallType: 'function',
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: toolCallDelta.function.arguments ?? '',
                });

                // check if tool call is complete
                if (
                  toolCall.function?.name != null &&
                  toolCall.function?.arguments != null &&
                  isParsableJson(toolCall.function.arguments)
                ) {
                  controller.enqueue({
                    type: 'tool-call',
                    toolCallType: 'function',
                    toolCallId: toolCall.id ?? generateId(),
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments,
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
          },

          flush(controller) {
            const providerMetadata: SharedV2ProviderMetadata = {
              [providerOptionsName]: {},
              //...metadataExtractor?.buildMetadata(),
            };
            if (
              usage.completionTokensDetails.acceptedPredictionTokens != null
            ) {
              providerMetadata[providerOptionsName].acceptedPredictionTokens =
                usage.completionTokensDetails.acceptedPredictionTokens;
            }
            if (
              usage.completionTokensDetails.rejectedPredictionTokens != null
            ) {
              providerMetadata[providerOptionsName].rejectedPredictionTokens =
                usage.completionTokensDetails.rejectedPredictionTokens;
            }

            controller.enqueue({
              type: 'finish',
              finishReason,
              usage: {
                inputTokens: usage.promptTokens ?? undefined,
                outputTokens: usage.completionTokens ?? undefined,
                totalTokens: usage.totalTokens ?? undefined,
                reasoningTokens:
                  usage.completionTokensDetails.reasoningTokens ?? undefined,
                cachedInputTokens:
                  usage.promptTokensDetails.cachedTokens ?? undefined,
              },
              providerMetadata,
            });
          },
        }),
      ),
      request: { body },
      response: { headers: responseHeaders },
    }
  }
}
