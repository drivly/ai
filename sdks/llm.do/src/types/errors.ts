import { ERROR_TYPES } from '../constants'
import { Prettify } from '@/types/helper-types'
import { ToolAuthorizationMode } from './tools'

type ErrorType = (typeof ERROR_TYPES)[number]
type BaseErrorType = Exclude<ErrorType, 'TOOL_AUTHORIZATION'>
type ToolAuthorizationErrorType = Extract<ErrorType, 'TOOL_AUTHORIZATION'>

interface GenericChatCompletionError extends Error {
  success: false
  type: string
  error: string
}

// Error for missing model or unsupported model capabilities
export interface BaseCompletionError extends GenericChatCompletionError {
  type: BaseErrorType
}

type AllBaseCompletionErrors = {
  [K in BaseErrorType]: BaseCompletionError & { type: K }
}[BaseErrorType]

export interface ToolConnectionRequest {
  app: string
  icon: string
  description: string
  methods: ToolConnectionMethod[]
}

export interface ToolConnectionMethod {
  type: ToolAuthorizationMode
  redirectUrl?: string
  fields?: Record<string, any>
}

// Tools based errors
export interface ToolAuthorizationError extends GenericChatCompletionError {
  type: ToolAuthorizationErrorType
  connectionRequests: ToolConnectionRequest[]
  apps: string[]
}

// Discriminated union by ErrorType
export type ChatCompletionError = Prettify<AllBaseCompletionErrors | ToolAuthorizationError>
