import { z } from 'zod'

export const CAREERS_DO_APPLIED_COOKIE_NAME = z.literal('careers_do_applied')

export const jobPositionSchema = z.object({
  position: z.enum(['AI Engineer', 'DevRel']),
})
const positionSchema = z.object({
  id: z.number(),
  position: jobPositionSchema.shape.position,
  description: z.string(),
  tags: z.array(z.string()),
})

export const jobPositions = [
  {
    id: 1,
    position: 'AI Engineer',
    description: 'Design and develop AI systems that deliver economically valuable work at scale.',
    tags: ['Typescript', 'Full-stack', 'Remote/Full-time'],
  },
  {
    id: 2,
    position: 'DevRel',
    description: 'Empower developers by building, supporting, and showcasing AI workflows through content, community, and real-world impact.',
    tags: ['Go-To-Market', 'Community', 'Remote/Full-time'],
  },
] satisfies z.infer<typeof positionSchema>[]

export type JobPosition = z.infer<typeof jobPositionSchema.shape.position>
