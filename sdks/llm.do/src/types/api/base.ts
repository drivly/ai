import type { LLMHeaders } from './requests'

/**
 * HTTP methods supported by the API
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Base route definition type that all API routes extend
 *
 * @template TMethod - The HTTP method for this route
 * @template TPath - The path string for this route
 * @template TBody - The request body type, if applicable
 * @template TResponse - The response data type
 * @template TError - The possible error types that can be thrown
 */
export type BaseRoute<TMethod extends HttpMethod, TPath extends string, TBody = undefined, TResponse = undefined, TError = undefined> = {
  method: TMethod
  route: TPath
  body?: TBody
  headers: LLMHeaders
  response?: TResponse
  throws?: TError
}

/**
 * Convenience type for GET routes
 *
 * @template TPath - The path string for this route
 * @template TResponse - The response data type
 * @template TError - The possible error types that can be thrown
 */
export type GetRoute<TPath extends string, TResponse = undefined, TError = undefined> = BaseRoute<'GET', TPath, undefined, TResponse, TError>

/**
 * Convenience type for POST routes
 *
 * @template TPath - The path string for this route
 * @template TBody - The request body type
 * @template TResponse - The response data type
 * @template TError - The possible error types that can be thrown
 */
export type PostRoute<TPath extends string, TBody = undefined, TResponse = undefined, TError = undefined> = BaseRoute<'POST', TPath, TBody, TResponse, TError>

/**
 * API path constants for consistent route definition
 * Provides type-safety and centralized definition of API routes
 */
export const API_PATHS = {
  CHAT: {
    /** Path for chat completions endpoint */
    COMPLETIONS: '/chat/completions' as const,
  },
  TOOLS: {
    /** Function to generate a tool-specific endpoint path */
    ROOT: (toolId: string) => `/tools/${toolId}` as const,
    /** Function to generate a tool OAuth endpoint path */
    OAUTH: (toolId: string) => `/tools/${toolId}/oauth` as const,
  },
  MODELS: {
    /** Path for listing models endpoint */
    LIST: '/models' as const,
  },
  IMAGES: {
    /** Function to generate a model image endpoint path */
    MODEL: (modelId: string) => `/images/models/${modelId}` as const,
    /** Function to generate a tool image endpoint path */
    TOOL: (toolId: string) => `/images/tools/${toolId}` as const,
  },
}
