import { API } from '@/lib/api'
import { waitUntil } from '@vercel/functions'
import { research } from '@/.ai/agents/research'
import hash from 'object-hash'

export const maxDuration = 600

/**
 * Store research results in the Resources collection
 * Only creates a new record if the hash doesn't already exist
 */
interface ResearchResults {
  citations: string[]
  markdown: string
  topic?: string
}

const storeResearchResults = async (payload: any, results: ResearchResults) => {
  try {
    const { citations, markdown } = results
    const resultsHash = hash({ citations, markdown })

    await payload.create({
      collection: 'resources',
      data: {
        name: `Research: ${results.topic || 'Unknown Topic'}`,
        hash: resultsHash,
        type: 'things', // Relationship type
        data: results,
        yaml: JSON.stringify(results),
        content: markdown,
      },
    })
    console.log('Stored new research results:', resultsHash)
    return { success: true }
  } catch (error) {
    console.info('Failed to store research results, likely duplicate')
    return { success: false, error }
  }
}

export const GET = API(async (request, { db, user, url, origin, domain, payload }) => {
  const searchQuery = request.nextUrl.search.replace(/^\?/, '')
  const results = await research(searchQuery)
  const { citations, markdown } = results

  const topic = searchQuery || 'Unknown Topic'

  const resultsWithTopic = {
    ...results,
    topic,
  }

  waitUntil(storeResearchResults(payload, resultsWithTopic))

  return { research: { results: markdown.split('\n'), citations, markdown } }
})

// export const GET = API(async (request, { db, user, url, origin, domain, payload }) => {
//   const searchParams = request.nextUrl.searchParams

//   if (searchParams.has('topic')) {
//     const topic = searchParams.get('topic')
//     const depth = searchParams.get('depth') || 'medium'
//     const format = searchParams.get('format') || 'markdown'
//     const sources = searchParams.get('sources')
//     const callback = searchParams.get('callback')

//     if (!topic) {
//       return NextResponse.json({ error: 'Missing required field: topic' }, { status: 400 })
//     }

//     try {
//       const newTask = await payload.create({
//         collection: 'tasks',
//         data: {
//           status: 'queued',
//           type: 'research',
//           input: { topic, depth, sources, format, callback },
//           user: user?.id,
//         },
//       })

//       const job = await payload.jobs.queue({
//         task: 'researchTask',
//         input: { topic, depth, sources, format, taskId: newTask.id, callback },
//       })

//       waitUntil(payload.jobs.runByID({ id: job.id }))

//       return NextResponse.json({ success: true, taskId: newTask.id, jobId: job.id }, { status: 202 })
//     } catch (error) {
//       console.error('Error queuing research task:', error)
//       return NextResponse.json({ error: 'Failed to queue research task' }, { status: 500 })
//     }
//   }

//   const page = parseInt(searchParams.get('page') || '1')
//   const limit = parseInt(searchParams.get('limit') || '20')
//   const showDomains = url.searchParams.has('domains')

//   const formatWithOptions = (path: string, defaultDomain?: string) =>
//     formatUrl(path, {
//       origin,
//       domain,
//       showDomains,
//       defaultDomain,
//     })

//   const researchTasks = await db.tasks.find({
//     where: {
//       type: 'research',
//       user: user?.id,
//     },
//     page,
//     limit,
//   })

//   const totalItems = Array.isArray(researchTasks) ? researchTasks.length : 0

//   const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
//   const links: { home: string; next?: string; prev?: string } = {
//     home: baseUrl,
//   }

//   if (totalItems === limit) {
//     const nextParams = new URLSearchParams(searchParams)
//     nextParams.set('page', (page + 1).toString())
//     links.next = `${baseUrl}?${nextParams.toString()}`
//   }

//   if (page > 1) {
//     const prevParams = new URLSearchParams(searchParams)
//     prevParams.set('page', (page - 1).toString())
//     links.prev = `${baseUrl}?${prevParams.toString()}`
//   }

//   const tasks: Record<string, string> = {}

//   if (Array.isArray(researchTasks)) {
//     for (const task of researchTasks) {
//       if (task && typeof task === 'object' && task.id) {
//         tasks[task.id] = formatWithOptions(`research/${task.id}`, 'research.do')
//       }
//     }
//   }

//   const exampleTopics = [
//     'Climate change solutions',
//     'Artificial intelligence advancements',
//     'Quantum computing applications',
//     'Renewable energy technologies',
//     'Space exploration breakthroughs',
//     'Biotechnology innovations',
//     'Sustainable agriculture practices'
//   ]

//   const examples: Record<string, string> = {}
//   for (const topic of exampleTopics) {
//     const encodedTopic = topic.replace(/ /g, '+')
//     examples[topic] = formatWithOptions(`research?topic=${encodedTopic}`, 'research.do')
//   }

//   return {
//     tasks,
//     links,
//     user,
//     page,
//     limit,
//     total: totalItems,
//     examples, // Add example topics with clickable links
//     actions: {
//       toggleDomains: url.searchParams.has('domains') ? url.toString().replace(/[?&]domains/, '') : url.toString() + (url.toString().includes('?') ? '&domains' : '?domains'),
//     },
//   }
// })

// export const POST = API(async (request, { payload, user }) => {
//   const { topic, depth, sources, format, callback } = await request.json()

//   if (!topic) {
//     return NextResponse.json({ error: 'Missing required field: topic' }, { status: 400 })
//   }

//   try {
//     const newTask = await payload.create({
//       collection: 'tasks', // Assuming 'tasks' is the collection slug
//       data: {
//         status: 'queued',
//         input: { topic, depth, sources, format, callback }, // Store original request input
//         user: user?.id,
//       },
//     })

//     const job = await payload.jobs.queue({
//       task: 'researchTask',
//       input: { topic, depth, sources, format, taskId: newTask.id, callback },
//     })

//     return NextResponse.json({ success: true, taskId: newTask.id, jobId: job.id }, { status: 202 })
//   } catch (error) {
//     console.error('Error queuing research task:', error)
//     return NextResponse.json({ error: 'Failed to queue research task' }, { status: 500 })
//   }
// })
