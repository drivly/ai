import { Str } from 'chanfana'
import { z } from 'zod'
import { CitationSchema, LocationSchema, ReasoningEffortSchema } from './shared'

export const GenerateSummarySchema = z.enum(['concise', 'detailed'])
export const TruncationSchema = z.enum(['auto', 'disabled'])

export const SafetyCheckSchema = z.object({
  code: z.string(),
  id: z.string(),
  message: z.string(),
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

export const InputSchema = z.array(
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

export const StatusSchema = z.enum(['in_progress', 'completed', 'incomplete'])

export const TextSchema = z.object({
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

export const ToolChoiceSchema = z
  .enum(['none', 'auto', 'required'])
  .or(z.object({ type: z.enum(['file_search', 'web_search_preview', 'computer_use_preview']) }))
  .or(z.object({ name: z.string(), type: z.literal('function') }))

export const OutputSchema = z
  .object({
    content: z.array(
      z
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
    ),
    id: z.string(),
    role: z.literal('assistant'),
    status: StatusSchema,
    type: z.literal('message'),
  })
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
      pending_safety_checks: z.array(SafetyCheckSchema),
      status: StatusSchema,
      type: z.literal('computer_call'),
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
  )
export type ResponseRequest = z.infer<typeof ResponseRequestSchema>
export const ResponseRequestSchema = z.object({
  input: z.string().or(
    z.array(
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
                call_id: z.string(),
                output: z.object({
                  type: z.literal('computer_screenshot'),
                  file_id: z.string().optional(),
                  image_url: z.string().optional(),
                }),
                type: z.literal('computer_call_output'),
                acknowledged_safety_checks: z.array(SafetyCheckSchema).optional(),
                id: z.string(),
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
            .or(OutputSchema),
        )
        .or(z.object({ id: z.string(), type: z.literal('item_reference') })),
    ),
  ),
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
      effort: ReasoningEffortSchema.optional(),
      generate_summary: GenerateSummarySchema.optional(),
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
  truncation: TruncationSchema.optional(),
  user: z.string().optional(),
})

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
  output: z.array(OutputSchema),
  parallel_tool_calls: z.boolean(),
  previous_response_id: z.string().nullable(),
  reasoning: z
    .object({
      effort: ReasoningEffortSchema.nullable(),
      generate_summary: GenerateSummarySchema.nullable(),
    })
    .nullable(),
  status: StatusSchema,
  temperature: z.number().nullable(),
  text: TextSchema,
  tool_choice: ToolChoiceSchema,
  top_p: z.number().nullable(),
  truncation: TruncationSchema.nullable(),
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
