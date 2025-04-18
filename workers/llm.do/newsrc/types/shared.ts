import { z } from 'zod'

export const AuthHeader = z.object({
  Authorization: z.string(),
})

export const CitationSchema = z.object({
  end_index: z.number(),
  start_index: z.number(),
  title: z.string(),
  url: z.string(),
})

export const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export type Error = z.infer<typeof ErrorSchema>

export const LocationSchema = z.object({
  type: z.literal('approximate'),
  city: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  timezone: z.string().optional(),
})

export const ReasoningEffortSchema = z.enum(['low', 'medium', 'high'])
