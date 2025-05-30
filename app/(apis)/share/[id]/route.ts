import { API, handleShareRequest } from '@/lib/api'
import { NextRequest } from 'next/server.js'

export const GET = API(async (req: NextRequest, ctx) => {
  const { id } = ctx.params

  return handleShareRequest({ id: id as string }, ctx.db)
})
