import { serverAuth } from '@/hooks/server-auth'
import { createSafeActionClient } from 'next-safe-action'

export const actionClient = createSafeActionClient()

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const user = await serverAuth()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return next({ ctx: { user } })
})
