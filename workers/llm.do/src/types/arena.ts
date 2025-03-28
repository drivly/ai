import { z } from 'zod'

export const ArenaCompletionRequestSchema = z.object({
  arena: z.record(z.string(), z.array(z.string())),
  user: z.string().optional(),
})

export type ArenaCompletionRequest = z.infer<typeof ArenaCompletionRequestSchema>
