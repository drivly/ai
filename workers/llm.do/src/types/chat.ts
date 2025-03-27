import { Str } from 'chanfana'
import { z } from 'zod'

export const AuthHeader = z.object({
  Authorization: z.string(),
})

const LogProb = z.object({
  bytes: z.array(z.number()).nullable(),
  logprob: z.number(),
  token: z.string(),
})

const LogProbs = z.array(
  LogProb.extend({
    top_logprobs: z.array(LogProb),
  }),
)

const MessageContent = z.string().or(
  z.array(
    z
      .object({
        text: z.string(),
        type: z.string(),
      })
      .or(
        z.object({
          image_url: z.object({
            url: z.string(),
            detail: z.string().nullable(),
          }),
          type: z.string(),
        }),
      )
      .or(
        z.object({
          input_audio: z.object({
            data: z.string(),
            format: z.string(),
          }),
          type: z.literal('input_audio'),
        }),
      )
      .or(
        z.object({
          file: z.object({
            file_data: z.string().nullable(),
            file_id: z.string().nullable(),
            filename: z.string().nullable(),
          }),
          type: z.literal('file'),
        }),
      ),
  ),
)

const Name = z
  .string()
  .regex(/^[a-zA-Z0-9_]+$/)
  .optional()

export const ChatCompletionRequestSchema = z.object({
  messages: z.array(
    z
      .object({
        content: MessageContent,
        role: z.literal('developer'),
        name: Name,
      })
      .or(
        z.object({
          content: MessageContent,
          role: z.literal('system'),
          name: Name,
        }),
      )
      .or(
        z.object({
          content: MessageContent,
          role: z.literal('user'),
          name: Name,
        }),
      )
      .or(
        z.object({
          role: z.literal('assistant'),
          audio: z.object({ id: z.string() }).optional(),
          content: z.string().or(z.array(z.string().or(z.object({ text: z.string(), type: z.literal('text') }).or(z.object({ refusal: z.string(), type: z.literal('refusal') }))))),
          name: Name,
        }),
      )
      .or(
        z.object({
          content: MessageContent,
          role: z.literal('tool'),
          tool_call_id: z.string(),
        }),
      )
      .or(
        z.object({
          content: z.string().or(z.null()),
          name: z.string(),
          role: z.literal('function'),
        }),
      ),
  ),
  model: Str({ example: 'gpt-4o' }).optional(),
  models: z.array(Str({ example: 'gpt-4o' })).optional(),
  audio: z
    .object({
      format: z.string(),
      voice: z.string(),
    })
    .or(z.null())
    .optional(),
  frequency_penalty: z.number().max(2).min(-2).optional(),
  function_call: z
    .string()
    .or(z.object({ name: z.string() }))
    .optional(),
  functions: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        parameters: z.record(z.any()).optional(),
      }),
    )
    .optional(),
  logit_bias: z.record(z.number()).optional(),
  logprobs: z.boolean().optional(),
  max_completion_tokens: z.number().optional(),
  max_tokens: z.number().optional(),
  metadata: z.record(z.string()).optional(),
  modalities: z
    .array(z.enum(['text', 'audio', 'image', 'video']))
    .or(z.null())
    .optional(),
  n: z.number().optional(),
  parallel_tool_calls: z.boolean().optional(),
  prediction: z
    .object({
      content: z.string().or(
        z.array(
          z.object({
            text: z.string(),
            type: z.string(),
          }),
        ),
      ),
      type: z.literal('content'),
    })
    .optional(),
  presence_penalty: z.number().optional(),
  reasoning_effort: z.enum(['low', 'medium', 'high']).optional(),
  response_format: z
    .object({ type: z.literal('text') })
    .or(z.object({ type: z.literal('json_object') }))
    .or(
      z.object({
        type: z.literal('json_schema'),
        json_schema: z.object({
          name: z.string(),
          description: z.string().optional(),
          schema: z.record(z.any()).optional(),
          strict: z.boolean().optional(),
        }),
      }),
    )
    .optional(),
  seed: z.number().optional(),
  service_tier: z.enum(['default', 'auto']).optional(),
  stop: z.string().or(z.array(z.string())).optional(),
  store: z.boolean().optional(),
  stream: z.boolean().optional(),
  stream_options: z
    .object({
      include_usage: z.boolean().optional(),
    })
    .optional(),
  temperature: z.number().optional(),
  tool_choice: z
    .string()
    .or(
      z.object({
        function: z.object({
          name: z.string(),
        }),
        type: z.literal('function'),
      }),
    )
    .optional(),
  tools: z
    .array(
      z
        .object({
          function: z.object({
            name: z.string(),
            description: z.string().optional(),
            parameters: z.record(z.any()).optional(),
            strict: z.boolean().optional().nullable(),
          }),
          type: z.literal('function').or(z.union([z.string(), z.object({})])),
        })
        .or(
          z.object({
            display_height: z.number(),
            display_width: z.number(),
            environment: z.string(),
            type: z.literal('computer_use_preview'),
          }),
        )
        .or(
          z.object({
            type: z.enum(['web_search_preview', 'web_search_preview_2025_03_11']),
            search_context_size: z.enum(['low', 'medium', 'high']).optional(),
            user_location: z.object({
              type: z.literal('approximate'),
              city: z.string().optional(),
              country: z.string().optional(),
              region: z.string().optional(),
              timezone: z.string().optional(),
            }),
          }),
        )
        .or(z.string()),
    )
    .optional(),
  top_logprobs: z.number().min(0).max(20).optional(),
  top_p: z.number().optional(),
  user: z.string().optional(),
})

export type ChatCompletionRequest = z.infer<typeof ChatCompletionRequestSchema>

export const ChatCompletionResponseSchema = z.object({
  choices: z.array(
    z.object({
      finish_reason: z.enum(['length', 'function_call', 'stop', 'tool_calls', 'content_filter']),
      index: z.number(),
      logprobs: z
        .object({
          content: LogProbs.nullable(),
          refusal: LogProbs.nullable(),
        })
        .nullable(),
      message: z.object({
        content: z.string().nullable(),
        refusal: z.string().nullable(),
        role: z.literal('assistant'),
        annotations: z
          .array(
            z.object({
              type: z.literal('url_citation'),
              url_citation: z.object({
                end_index: z.number(),
                start_index: z.number(),
                title: z.string(),
                url: z.string(),
              }),
            }),
          )
          .optional(),
        audio: z
          .object({
            data: z.string(),
            expires_at: z.number(),
            id: z.string(),
            transcript: z.string(),
          })
          .nullable(),
        tool_calls: z
          .array(
            z.object({
              function: z.object({
                arguments: z.string(),
                name: z.string(),
              }),
              id: z.string(),
              type: z.literal('function'),
            }),
          )
          .optional(),
      }),
    }),
  ),
  created: z.number(),
  id: z.string(),
  model: z.string(),
  object: z.literal('chat.completion'),
  service_tier: z.enum(['default', 'scale']).nullable().optional(),
  system_fingerprint: z.string(),
  usage: z.object({
    completion_tokens: z.number(),
    prompt_tokens: z.number(),
    total_tokens: z.number(),
    completion_tokens_details: z.object({
      accepted_prediction_tokens: z.number(),
      audio_tokens: z.number(),
      reasoning_tokens: z.number(),
      rejected_prediction_tokens: z.number(),
    }),
    prompt_tokens_details: z.object({
      audio_tokens: z.number(),
      cached_tokens: z.number(),
    }),
  }),
})

export type ChatCompletionResponse = z.infer<typeof ChatCompletionResponseSchema>

export const ModelListResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      created: z.number(),
      description: z.string(),
      context_length: z.number(),
      architecture: z.object({
        modality: z.string(),
        tokenizer: z.string(),
        instruct_type: z.string().optional(),
      }),
      pricing: z.object({
        prompt: z.string(),
        completion: z.string(),
        image: z.string(),
        request: z.string(),
        input_cache_read: z.string(),
        input_cache_write: z.string(),
        web_search: z.string(),
        internal_reasoning: z.string(),
      }),
      top_provider: z.object({
        context_length: z.number(),
        max_completion_tokens: z.number(),
        is_moderated: z.boolean(),
      }),
      per_request_limits: z.null(),
    }),
  ),
})

export const ResponseRequestSchema = z.object({
  model: Str({ example: 'gpt-4o' }),
  prompt_messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  max_tokens: z.number().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  seed: z.number().optional(),
  stream: z.boolean().optional(),
  n: z.number().optional(),
  stop: z.string().or(z.array(z.string())).optional(),
  file_paths: z.array(z.string()).optional(),
  image_paths: z.array(z.string()).optional(),
  response_format: z
    .object({ type: z.literal('text') })
    .or(z.object({ type: z.literal('json_object') }))
    .optional(),
  user: z.string().optional(),
})

export type ResponseRequest = z.infer<typeof ResponseRequestSchema>

export const ResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  created_at: z.number(),
  response_id: z.string(),
  eta: z.number().optional(),
  content: z.array(
    z.object({
      text: z.string(),
      type: z.literal('text'),
    })
  ).or(z.string()),
  choices: z.array(
    z.object({
      index: z.number(),
      finish_reason: z.enum(['stop', 'length', 'content_filter']),
    })
  ).optional(),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }).optional(),
  object: z.literal('response'),
})

export type Response = z.infer<typeof ResponseSchema>
