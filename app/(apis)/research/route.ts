import { API, formatUrl } from '@/lib/api'
import { NextResponse } from 'next/server.js'
import { waitUntil } from '@vercel/functions'

export const GET = API(async (request, { db, user, url, origin, domain, payload }) => {
  const searchParams = request.nextUrl.searchParams

  if (searchParams.has('topic')) {
    const topic = searchParams.get('topic')
    const depth = searchParams.get('depth') || 'medium'
    const format = searchParams.get('format') || 'markdown'
    const sources = searchParams.get('sources')
    const callback = searchParams.get('callback')

    if (!topic) {
      return NextResponse.json({ error: 'Missing required field: topic' }, { status: 400 })
    }

    try {
      const newTask = await payload.create({
        collection: 'tasks',
        data: {
          status: 'queued',
          type: 'research',
          input: { topic, depth, sources, format, callback },
          user: user?.id,
        },
      })

      const job = await payload.jobs.queue({
        task: 'researchTask',
        input: { topic, depth, sources, format, taskId: newTask.id, callback },
      })

      waitUntil(payload.jobs.runByID({ id: job.id }))

      return NextResponse.json({ success: true, taskId: newTask.id, jobId: job.id }, { status: 202 })
    } catch (error) {
      console.error('Error queuing research task:', error)
      return NextResponse.json({ error: 'Failed to queue research task' }, { status: 500 })
    }
  }

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const showDomains = url.searchParams.has('domains')

  const formatWithOptions = (path: string, defaultDomain?: string) =>
    formatUrl(path, {
      origin,
      domain,
      showDomains,
      defaultDomain,
    })

  const researchTasks = await db.tasks.find({
    where: {
      type: 'research',
      user: user?.id,
    },
    page,
    limit,
  })

  const totalItems = Array.isArray(researchTasks) ? researchTasks.length : 0

  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
  const links: { home: string; next?: string; prev?: string } = {
    home: baseUrl,
  }

  if (totalItems === limit) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', (page + 1).toString())
    links.next = `${baseUrl}?${nextParams.toString()}`
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(searchParams)
    prevParams.set('page', (page - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }

  const tasks: Record<string, string> = {}

  if (Array.isArray(researchTasks)) {
    for (const task of researchTasks) {
      if (task && typeof task === 'object' && task.id) {
        tasks[task.id] = formatWithOptions(`research/${task.id}`, 'research.do')
      }
    }
  }

  return {
    tasks,
    links,
    user,
    page,
    limit,
    total: totalItems,
    actions: {
      toggleDomains: url.searchParams.has('domains') ? url.toString().replace(/[?&]domains/, '') : url.toString() + (url.toString().includes('?') ? '&domains' : '?domains'),
    },
  }
})

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
