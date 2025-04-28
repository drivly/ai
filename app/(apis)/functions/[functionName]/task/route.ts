import { API } from '@/lib/api'
import { waitUntil } from '@vercel/functions'

export const POST = API(async (request, { payload, params }) => {
  const { functionName } = params
  const { input, config } = await request.json()

  const createdJob = await payload.jobs.queue({
    task: 'executeFunction',
    input: {
      functionName,
      args: input,
      settings: config,
    },
  })

  waitUntil(payload.jobs.runByID({ id: createdJob.id }))

  return {
    taskId: createdJob.id,
    status: 'queued',
    message: `Function execution task created: ${functionName}`,
  }
})
