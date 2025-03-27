import type { ChatCompletionRequest, ChatCompletionResponse, Response } from './chat'

export function toChatCompletionRequest(request: ResponseRequest): ChatCompletionRequest {}

export function toResponse(response: ChatCompletionResponse): Response {}
