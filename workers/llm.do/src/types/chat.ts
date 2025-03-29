import { Str } from 'chanfana'
import { effect, z } from 'zod'

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

const LocationSchema = z.object({
  type: z.literal('approximate'),
  city: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  timezone: z.string().optional(),
})

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
            user_location: LocationSchema,
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

export const ArenaCompletionRequestSchema = z.object({
  arena: z.record(z.string(), z.array(z.string())),
  user: z.string().optional(),
})

export type ArenaCompletionRequest = z.infer<typeof ArenaCompletionRequestSchema>


const CitationSchema = z.object({
  end_index: z.number(),
  start_index: z.number(),
  title: z.string(),
  url: z.string(),
})

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
              url_citation: CitationSchema,
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

export const ComparisonFilterSchema = z.object({
  key: z.string(),
  type: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte']),
  value: z.string(),
})

const BaseCompoundFilterSchema = z.object({
  type: z.enum(['and', 'or']),
})

export const CompoundFilterSchema = BaseCompoundFilterSchema.extend({
  filters: z.array(ComparisonFilterSchema.or(BaseCompoundFilterSchema)),
})

const InputSchema = z.array(
  z
    .object({
      text: z.string(),
      type: z.literal('input_text'),
    })
    .or(
      z.object({
        type: z.literal('input_file'),
        file_data: z.string().optional(),
        file_id: z.string().optional(),
        filename: z.string().optional(),
      }),
    )
    .or(
      z.object({
        detail: z.enum(['high', 'low', 'auto']).optional(),
        type: z.literal('input_image'),
        file_id: z.string().optional(),
        image_url: z.string().optional(),
      }),
    ),
)

const StatusSchema = z.enum(['in_progress', 'completed', 'incomplete'])

const TextSchema = z.object({
  format: z
    .object({ type: z.literal('text') })
    .or(
      z.object({
        name: z.string(),
        schema: z.record(z.any()),
        type: z.literal('json_schema'),
        description: z.string().optional(),
        strict: z.boolean().optional(),
      }),
    )
    .or(z.object({ type: z.literal('json_object') })),
})

const ToolChoiceSchema = z
  .enum(['none', 'auto', 'required'])
  .or(z.object({ type: z.enum(['file_search', 'web_search_preview', 'computer_use_preview']) }))
  .or(z.object({ name: z.string(), type: z.literal('function') }))

const MessagesSchema = z.array(
  z
    .object({
      content: z.string().or(z.array(z.string().or(InputSchema))),
      role: z.enum(['user', 'assistant', 'system', 'developer']),
      type: z.literal('message').optional(),
    })
    .or(
      z
        .object({
          content: InputSchema,
          role: z.enum(['user', 'system', 'developer']),
          status: StatusSchema.optional(),
          type: z.literal('message').optional(),
        })
        .or(
          z.object({
            content: z
              .object({
                annotations: z.array(
                  z
                    .object({
                      file_id: z.string(),
                      index: z.number(),
                      type: z.literal('file_citation'),
                    })
                    .or(CitationSchema.extend({ type: z.literal('url_citation') }))
                    .or(
                      z.object({
                        file_id: z.string(),
                        index: z.number(),
                        type: z.literal('file_path'),
                      }),
                    ),
                ),
                text: z.string(),
                type: z.literal('output_text'),
              })
              .or(
                z.object({
                  refusal: z.string(),
                  type: z.literal('refusal'),
                }),
              ),
            id: z.string(),
            role: z.literal('assistant'),
            status: StatusSchema,
            type: z.literal('message'),
          }),
        )
        .or(
          z.object({
            id: z.string(),
            queries: z.array(z.string()),
            status: StatusSchema,
            type: z.literal('file_search_call'),
            results: z
              .array(
                z.object({
                  attributes: z.record(z.string()),
                  file_id: z.string().optional(),
                  filename: z.string().optional(),
                  score: z.number().optional(),
                  text: z.string().optional(),
                }),
              )
              .optional(),
          }),
        )
        .or(
          z.object({
            action: z
              .object({
                button: z.enum(['left', 'right', 'wheel', 'back', 'forward']),
                type: z.literal('click'),
                x: z.number(),
                y: z.number(),
              })
              .or(
                z.object({
                  type: z.literal('double_click'),
                  x: z.number(),
                  y: z.number(),
                }),
              )
              .or(
                z.object({
                  type: z.literal('drag'),
                }),
              )
              .or(
                z.object({
                  keys: z.array(z.string()),
                  type: z.literal('keypress'),
                }),
              )
              .or(
                z.object({
                  type: z.literal('move'),
                  x: z.number(),
                  y: z.number(),
                }),
              )
              .or(
                z.object({
                  type: z.literal('screenshot'),
                }),
              )
              .or(
                z.object({
                  scroll_x: z.number(),
                  scroll_y: z.number(),
                  type: z.literal('scroll'),
                  x: z.number(),
                  y: z.number(),
                }),
              )
              .or(
                z.object({
                  text: z.string(),
                  type: z.literal('type'),
                }),
              )
              .or(
                z.object({
                  type: z.literal('wait'),
                }),
              ),
            call_id: z.string(),
            id: z.string(),
            pending_safety_checks: z.array(
              z.object({
                code: z.string(),
                id: z.string(),
                message: z.string(),
              }),
            ),
            status: StatusSchema,
            type: z.literal('computer_call'),
          }),
        )
        .or(
          z.object({
            call_id: z.string(),
            output: z.object({
              type: z.literal('computer_screenshot'),
              file_id: z.string().optional(),
              image_url: z.string().optional(),
            }),
            type: z.literal('computer_call_output'),
            acknowledged_safety_checks: z
              .array(
                z.object({
                  code: z.string(),
                  id: z.string(),
                  message: z.string(),
                }),
              )
              .optional(),
            id: z.string(),
            status: StatusSchema.optional(),
          }),
        )
        .or(
          z.object({
            id: z.string(),
            status: z.string(),
            type: z.literal('web_search_call'),
          }),
        )
        .or(
          z.object({
            arguments: z.string(),
            call_id: z.string(),
            name: z.string(),
            type: z.literal('function_call'),
            id: z.string().optional(),
            status: StatusSchema.optional(),
          }),
        )
        .or(
          z.object({
            call_id: z.string(),
            output: z.string(),
            type: z.literal('function_call_output'),
            id: z.string().optional(),
            status: StatusSchema.optional(),
          }),
        )
        .or(
          z.object({
            id: z.string(),
            summary: z.array(
              z.object({
                text: z.string(),
                type: z.literal('summary_text'),
              }),
            ),
            type: z.literal('reasoning'),
            status: StatusSchema.optional(),
          }),
        ),
    )
    .or(z.object({ id: z.string(), type: z.literal('item_reference') })),
)

export const ResponseRequestSchema = z.object({
  input: z.string().or(MessagesSchema),
  model: Str({ example: 'gpt-4o' }).optional(),
  models: z.array(Str({ example: 'gpt-4o' })).optional(),
  include: z.array(z.enum(['file_search_call.results', 'message.input_image.image_url', 'computer_call_output.output.image_url'])).optional(),
  instructions: z.string().optional(),
  max_output_tokens: z.number().optional(),
  metadata: z.record(z.string()).optional(),
  parallel_tool_calls: z.boolean().optional(),
  previous_response_id: z.string().optional(),
  reasoning: z
    .object({
      effort: z.enum(['low', 'medium', 'high']).optional(),
      generate_summary: z.enum(['concise', 'detailed']).optional(),
    })
    .optional(),
  store: z.boolean().optional(),
  stream: z.boolean().optional(),
  temperature: z.number().optional(),
  text: TextSchema.optional(),
  tool_choice: ToolChoiceSchema.optional(),
  tools: z
    .array(
      z
        .object({
          type: z.literal('file_search'),
          vector_store_ids: z.array(z.string()),
          filters: ComparisonFilterSchema.or(CompoundFilterSchema).optional(),
          max_num_results: z.number().optional(),
          ranking_options: z
            .object({
              ranker: z.string(),
              score_threshold: z.number().min(0).max(1),
            })
            .optional(),
        })
        .or(
          z.object({
            name: z.string(),
            parameters: z.record(z.any()).optional(),
            strict: z.boolean().optional(),
            description: z.string().optional(),
            type: z.literal('function'),
          }),
        )
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
            search_context_size: z.string().optional(),
            user_location: LocationSchema,
          }),
        ),
    )
    .optional(),
  top_p: z.number().optional(),
  truncation: z.enum(['auto', 'disabled']).optional(),
  user: z.string().optional(),
})

export type ResponseRequest = z.infer<typeof ResponseRequestSchema>

export const ResponseSchema = z.object({
  created_at: z.number(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .nullable(),
  id: z.string(),
  incomplete_details: z
    .object({
      reason: z.string(),
    })
    .nullable(),
  instructions: z.string().nullable(),
  max_output_tokens: z.number().nullable(),
  metadata: z.record(z.string()),
  model: Str({ example: 'gpt-4o' }),
  object: z.literal('response'),
  output: MessagesSchema,
  parallel_tool_calls: z.boolean(),
  previous_response_id: z.string().nullable(),
  reasoning: z
    .object({
      effort: z.enum(['low', 'medium', 'high']).nullable(),
      generate_summary: z.enum(['concise', 'detailed']).nullable(),
    })
    .nullable(),
  status: StatusSchema,
  temperature: z.number().nullable(),
  text: TextSchema,
  tool_choice: ToolChoiceSchema,
  top_p: z.number().nullable(),
  truncation: z.enum(['auto', 'disabled']).nullable(),
  usage: z.object({
    input_tokens: z.number(),
    input_tokens_details: z.object({
      cached_tokens: z.number(),
    }),
    output_tokens: z.number(),
    output_tokens_details: z.object({
      reasoning_tokens: z.number(),
    }),
    total_tokens: z.number(),
  }),
  user: z.string().nullable(),
})

export type Response = z.infer<typeof ResponseSchema>
