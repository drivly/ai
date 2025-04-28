import { PayloadRequest } from 'payload/types'
import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createApiHandler } from '../../../../../lib/api'

export const POST = createApiHandler(async (req: NextRequest & PayloadRequest) => {
  const { functionName } = req.params as { functionName: string }
  const { input, config } = await req.json()

  const createdJob = await req.payload.jobs.queue({
    task: 'executeFunction',
    input: {
      functionName,
      args: input,
      settings: config,
    },
  })

  waitUntil(req.payload.jobs.runByID({ id: createdJob.id }))

  return NextResponse.json({
    taskId: createdJob.id,
    status: 'queued',
    message: `Function execution task created: ${functionName}`,
  })
})
