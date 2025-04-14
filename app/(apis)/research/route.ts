import { API } from '@/lib/api'
import { NextResponse } from 'next/server'

export const POST = API(async (request, { payload, user }) => {
  const { topic, depth, sources, format, callback } = await request.json()

  if (!topic) {
    return NextResponse.json({ error: 'Missing required field: topic' }, { status: 400 })
  }

  try {
    const newTask = await payload.create({
      collection: 'tasks', // Assuming 'tasks' is the collection slug
      data: {
        status: 'queued',
        input: { topic, depth, sources, format, callback }, // Store original request input
        user: user?.id,
      },
    })

    const job = await payload.jobs.queue({
      task: 'researchTask',
      input: { topic, depth, sources, format, taskId: newTask.id, callback },
    })

    return NextResponse.json({ success: true, taskId: newTask.id, jobId: job.id }, { status: 202 })
  } catch (error) {
    console.error('Error queuing research task:', error)
    return NextResponse.json({ error: 'Failed to queue research task' }, { status: 500 })
  }
})
