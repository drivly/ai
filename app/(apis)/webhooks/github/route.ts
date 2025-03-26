import { waitUntil } from '@vercel/functions'
import { API } from 'clickable-apis'
import { Webhook } from 'svix'

export const POST = API(async (request, { db, user, origin, url, domain, payload }) => {
  // Get the raw body
  const rawBody = await request.text()

  try {
    // Parse the verified payload
    const data = JSON.parse(rawBody)

    // Initiate a workflow instance
    const job = await payload.jobs.queue({ workflow: 'handleGithubEvent', input: { payload: data } })
    console.log({ job })
    waitUntil(payload.jobs.runByID({ id: job.id }))

    // Store the event in the database
    const results = await payload.create({ collection: 'events', data: { data } })

    console.log('Webhook verified and processed:', results, data)
    return { results, data }
  } catch (err) {
    console.error(err)
    return new Response('Webhook processing failed', { status: 401 })
  }
})
