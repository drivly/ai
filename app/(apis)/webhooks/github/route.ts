import { API } from 'clickable-apis'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Webhook } from 'svix'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  // Get the raw body
  const rawBody = await request.text()

  try {
    // Parse the verified payload
    const data = JSON.parse(rawBody)

    // Store the event in the database
    const payloadInstance = await getPayload({ config })
    const results = await payloadInstance.create({ collection: 'events', data: { data } })

    console.log('Webhook verified and processed:', results, data)
    return { results, data }
  } catch (err) {
    console.error(err)
    return new Response('Webhook processing failed', { status: 401 })
  }
})
