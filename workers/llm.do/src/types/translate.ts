import type { ChatCompletionRequest, ChatCompletionResponse, Response, ResponseRequest } from './chat'

export function toChatCompletionRequest(request: ResponseRequest): ChatCompletionRequest {
  const completionRequest: ChatCompletionRequest = {
    messages: [],
    model: request.model,
  }

  if (typeof request.input === 'string') {
    completionRequest.messages = [
      {
        role: 'user',
        content: request.input,
      },
    ]
  } else {
    const messages: ChatCompletionRequest['messages'] = []

    for (const message of request.input) {
      if ('role' in message && message.role) {
        const convertedMessage: any = {
          role: message.role,
          content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
        }

        if ('name' in message && message.name) {
          convertedMessage.name = message.name
        }

        messages.push(convertedMessage)
      } else {
        messages.push({
          role: 'user',
          content: JSON.stringify(message),
        })
      }
    }

    completionRequest.messages = messages
  }

  if (request.models) completionRequest.models = request.models
  if (request.max_output_tokens) completionRequest.max_tokens = request.max_output_tokens
  if (request.metadata) completionRequest.metadata = request.metadata
  if (request.parallel_tool_calls) completionRequest.parallel_tool_calls = request.parallel_tool_calls
  if (request.temperature) completionRequest.temperature = request.temperature

  if (request.tool_choice) {
    if (typeof request.tool_choice === 'string') {
      if (request.tool_choice === 'auto' || request.tool_choice === 'none') {
        completionRequest.tool_choice = request.tool_choice
      } else if (request.tool_choice === 'required') {
        completionRequest.tool_choice = 'auto' // Map 'required' to 'auto'
      }
    } else if (request.tool_choice.type === 'function') {
      completionRequest.tool_choice = {
        type: 'function',
        function: { name: request.tool_choice.name },
      }
    }
  }

  if (request.tools) {
    const convertedTools: ChatCompletionRequest['tools'] = []

    for (const tool of request.tools) {
      if (tool.type === 'function') {
        convertedTools.push({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters || {},
            strict: tool.strict || null,
          },
        })
      }
    }

    if (convertedTools.length > 0) {
      completionRequest.tools = convertedTools
    }
  }

  if (request.top_p) completionRequest.top_p = request.top_p
  if (request.user) completionRequest.user = request.user
  if (request.stream) completionRequest.stream = request.stream

  return completionRequest
}

export function toResponse(response: ChatCompletionResponse): Response {
  const choice = response.choices[0]

  const result: Response = {
    created_at: response.created,
    error: null,
    id: response.id,
    incomplete_details: null,
    instructions: null,
    max_output_tokens: null,
    metadata: {},
    model: response.model,
    object: 'response',
    output: [],
    parallel_tool_calls: false,
    previous_response_id: null,
    reasoning: null,
    status: 'completed',
    temperature: null,
    text: { format: { type: 'text' } },
    tool_choice: 'auto',
    top_p: null,
    truncation: null,
    usage: {
      input_tokens: response.usage.prompt_tokens,
      input_tokens_details: {
        cached_tokens: response.usage.prompt_tokens_details?.cached_tokens || 0,
      },
      output_tokens: response.usage.completion_tokens,
      output_tokens_details: {
        reasoning_tokens: response.usage.completion_tokens_details?.reasoning_tokens || 0,
      },
      total_tokens: response.usage.total_tokens,
    },
    user: null,
  }

  if (choice && choice.message) {
    result.output = [
      {
        content: {
          text: choice.message.content || '',
          type: 'output_text',
          annotations: [],
        },
        id: response.id,
        role: 'assistant',
        status: 'completed',
        type: 'message',
      },
    ]
  }

  return result
}
