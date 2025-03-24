import { API } from 'clickable-apis'
import { getPayload } from 'payload'
import config from '@payload-config'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  const payload = await getPayload({ config })
  const data = await request.json()
  const results = await payload.create({ collection: 'events', data: { data } })
  console.log(results, data)
  return { results, data }
})
