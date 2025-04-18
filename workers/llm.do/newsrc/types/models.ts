import { z } from 'zod'

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
