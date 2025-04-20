import { openai } from '@ai-sdk/openai'
import type { Tool } from 'ai'
import {
  AISDKError,
  InvalidArgumentError,
  InvalidStreamPartError,
  InvalidToolArgumentsError,
  NoObjectGeneratedError,
  NoSuchProviderError,
  NoSuchToolError,
  ToolExecutionError,
  streamText,
} from 'ai'
import { NextRequest, NextResponse } from 'next/server.js'
import { PROMPT_TEMPLATES, type SystemPromptContext } from './lib'
import type { PromptTemplate } from './lib/prompt-templates'
import type { PayloadAgentAuthResult } from './types/auth'

/**
 * Basic options for chat route configuration without authentication
 * @interface BaseChatRouteOptions
 */
export interface BaseChatRouteOptions {
  /**
   * OpenAI model to use for chat responses
   * @default 'gpt-4'
   */
  model?: Parameters<typeof openai.responses>[number]

  /**
   * Model-specific configuration options
   */
  modelOptions?: {
    /**
     * Temperature controls randomness (0-2). Higher is more random
     * @default 0.7
     */
    temperature?: number

    /**
     * Maximum tokens to generate in response
     */
    maxTokens?: number

    /**
     * Penalize new tokens based on presence in existing text (-2.0 to 2.0)
     */
    presencePenalty?: number

    /**
     * Penalize new tokens based on frequency in existing text (-2.0 to 2.0)
     */
    frequencyPenalty?: number
  }

  /**
   * Tools available for the AI to use during conversation
   */
  tools?: Record<string, Tool>

  /**
   * System prompt as string or template function
   * @default PROMPT_TEMPLATES.BASE
   */
  systemPrompt?: string | PromptTemplate

  /**
   * Additional context passed to prompt template
   */
  promptContext?: Record<string, unknown>

  /**
   * Custom error message handler
   * @param error - The error that occurred
   * @returns Formatted error message
   */
  errorHandler?: (error: unknown) => string

  /**
   * Whether to stream tool call responses
   * @default true
   */
  toolCallStreaming?: boolean
}

/**
 * Chat route options with authentication
 * @interface AuthChatRouteOptions
 * @extends BaseChatRouteOptions
 */
export interface AuthChatRouteOptions extends BaseChatRouteOptions {
  /**
   * Function to retrieve authentication result
   * @returns Promise resolving to auth result
   */
  getAuthResult: () => Promise<PayloadAgentAuthResult>

  /**
   * Whether authentication is required to use chat
   * @default true when getAuthResult is provided
   */
  requireAuth?: boolean
}

/**
 * Chat route options without authentication
 * @interface NoAuthChatRouteOptions
 * @extends BaseChatRouteOptions
 */
export interface NoAuthChatRouteOptions extends BaseChatRouteOptions {
  /**
   * Auth result function is undefined for this option
   */
  getAuthResult?: undefined

  /**
   * Can only be false when getAuthResult isn't provided
   */
  requireAuth?: false
}

/**
 * Combined dynamic type for chat route options
 * When getAuthResult is provided, requireAuth defaults to true
 * When getAuthResult is not provided, requireAuth must be false
 */
export type ChatRouteOptions = AuthChatRouteOptions | NoAuthChatRouteOptions

/**
 * Creates a chat route handler with configurable options
 * @param options Configuration options for the chat route
 * @returns NextJS route handler for chat functionality
 */
function createChatRoute(options: ChatRouteOptions = {}) {
  const {
    model = 'gpt-4o',
    modelOptions = {},
    tools = {},
    systemPrompt = PROMPT_TEMPLATES.BASE,
    promptContext = {},
    toolCallStreaming = true,
    errorHandler = defaultErrorHandler,
    getAuthResult,
    requireAuth = getAuthResult ? true : false,
  } = options

  return async (req: NextRequest) => {
    // Simple health check or status endpoint
    if (req.method === 'GET') {
      return NextResponse.json({ status: 'AI Chat API is running' })
    }

    // Only get auth if required
    const auth = requireAuth && getAuthResult ? await getAuthResult() : { user: null }

    if (requireAuth && !auth.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    console.log('auth', auth.user?.collection === 'apikeys')
    // Handle POST requests (chat completions)
    const { messages } = await req.json()
    if (!messages) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const context: SystemPromptContext = {
      user: auth.user ?? undefined,
      customContext: promptContext,
    }

    const fullSystemPrompt = typeof systemPrompt === 'function' ? systemPrompt(context) : systemPrompt

    try {
      const result = streamText({
        model: openai.responses(model),
        system: fullSystemPrompt,
        messages,
        tools,
        toolCallStreaming,
        ...modelOptions,
      })

      return result.toDataStreamResponse({
        getErrorMessage: errorHandler,
      })
    } catch (error) {
      debugError(error)
      return NextResponse.json({ error: defaultErrorHandler(error, true) }, { status: 500 })
    }
  }
}

function defaultErrorHandler(error: unknown, skipDebugLog = false) {
  debugError(error, skipDebugLog)
  if (NoSuchToolError.isInstance(error)) {
    return `Tool "${error.toolName}" is not available${error.availableTools ? `. Available tools: ${error.availableTools.join(', ')}` : ''}`
  }

  if (InvalidToolArgumentsError.isInstance(error)) {
    return `Invalid arguments provided for tool "${error.toolName}": ${error.toolArgs}`
  }

  if (InvalidArgumentError.isInstance(error)) {
    return `Invalid argument "${error.parameter}" for ${error.value}`
  }

  if (ToolExecutionError.isInstance(error)) {
    return `Failed to execute tool "${error.toolName}"`
  }

  // Model/Provider errors
  if (NoSuchProviderError.isInstance(error)) {
    return `Provider not found: ${error.providerId}`
  }

  // Stream errors
  if (InvalidStreamPartError.isInstance(error)) {
    return `Invalid stream response: ${error.chunk}`
  }

  // Generation errors
  if (NoObjectGeneratedError.isInstance(error)) {
    return `Failed to generate content: ${error.text}`
  }

  // Catch any other AI SDK errors
  if (AISDKError.isInstance(error)) {
    return error.message
  }

  return error instanceof Error ? error.message : 'An unknown error occurred'
}

function debugError(error: unknown, skipDebugLog = false) {
  if (process.env.NODE_ENV === 'development' && !skipDebugLog) {
    const details = {
      type: error instanceof Error ? error.constructor.name : typeof error,
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      cause: error instanceof Error ? error.cause : undefined,
      // Add specific error details
      ...(NoSuchToolError.isInstance(error) && {
        toolName: error.toolName,
        availableTools: error.availableTools,
      }),
      ...(InvalidToolArgumentsError.isInstance(error) && {
        toolName: error.toolName,
        toolArgs: error.toolArgs,
      }),
      ...(InvalidArgumentError.isInstance(error) && {
        parameter: error.parameter,
        value: error.value,
      }),
      ...(ToolExecutionError.isInstance(error) && {
        toolName: error.toolName,
        toolArgs: error.toolArgs,
        toolCallId: error.toolCallId,
      }),
      ...(NoSuchProviderError.isInstance(error) && {
        providerId: error.providerId,
        modelId: error.modelId,
        availableProviders: error.availableProviders,
      }),
      ...(InvalidStreamPartError.isInstance(error) && {
        chunk: error.chunk,
      }),
      ...(NoObjectGeneratedError.isInstance(error) && {
        text: error.text,
        usage: error.usage,
        response: error.response,
      }),
    }

    console.debug('AI Error details:', details)
  }
}

export default createChatRoute
