import type { LLMHeaders } from './requests'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type BaseRoute<TMethod extends HttpMethod, TPath extends string, TBody = undefined, TResponse = undefined, TError = undefined> = {
  method: TMethod
  route: TPath
  body?: TBody
  headers: LLMHeaders
  response?: TResponse
  throws?: TError
}

export type GetRoute<TPath extends string, TResponse = undefined, TError = undefined> = BaseRoute<'GET', TPath, undefined, TResponse, TError>

export type PostRoute<TPath extends string, TBody = undefined, TResponse = undefined, TError = undefined> = BaseRoute<'POST', TPath, TBody, TResponse, TError>

// API path constants - easier to maintain and validate
export const API_PATHS = {
  CHAT: {
    COMPLETIONS: '/chat/completions' as const,
  },
  TOOLS: {
    ROOT: (toolId: string) => `/tools/${toolId}` as const,
    OAUTH: (toolId: string) => `/tools/${toolId}/oauth` as const,
  },
  MODELS: {
    LIST: '/models' as const,
  },
  IMAGES: {
    MODEL: (modelId: string) => `/images/models/${modelId}` as const,
    TOOL: (toolId: string) => `/images/tools/${toolId}` as const,
  },
}
