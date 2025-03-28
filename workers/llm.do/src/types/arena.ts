import { z } from 'zod'

export const ArenaCompletionSchema = z.object({
  arena: z.record(z.string(), z.array(z.string())),
  user: z.string().optional(),
})
