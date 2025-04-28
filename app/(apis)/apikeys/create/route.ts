import { API } from '@/lib/api'
import { nanoid } from 'nanoid'

export const GET = API(async (request, { user, url }) => {
  if (!user?.id) {
    return { error: { message: 'Unauthorized', status: 401 } }
  }

  return {
    message: 'API Key creation form',
    links: {
      self: `${url.origin}/apikeys/create`,
      back: `${url.origin}/apikeys`,
      home: `${url.origin}/`,
    },
    fields: [
      { name: 'name', label: 'API Key Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'email', label: 'Contact Email', type: 'email' },
      { name: 'url', label: 'Website URL', type: 'url' },
      {
        name: 'cfWorkerDomains',
        label: 'Cloudflare Worker Domains',
        type: 'array',
        description: 'Domains of authorized Cloudflare Workers',
      },
    ],
    action: `${url.origin}/apikeys/create`,
    method: 'POST',
  }
})

export const POST = API(async (request, { db, user }) => {
  if (!user?.id) {
    return { error: { message: 'Unauthorized', status: 401 } }
  }

  const data = await request.json()

  if (!data.name) {
    return {
      error: {
        message: 'API Key name is required',
        status: 400,
      },
    }
  }

  const apiKey = `key_${nanoid(32)}`

  let cfWorkerDomains = []
  if (data.cfWorkerDomains) {
    if (typeof data.cfWorkerDomains === 'string') {
      cfWorkerDomains = [{ domain: data.cfWorkerDomains }]
    } else if (Array.isArray(data.cfWorkerDomains)) {
      cfWorkerDomains = data.cfWorkerDomains.map((domain: string | { domain: string }) => {
        if (typeof domain === 'string') {
          return { domain }
        }
        return domain
      })
    }
  }

  const newKey = await db.apikeys.create({
    name: data.name,
    description: data.description || '',
    email: data.email || user.email,
    url: data.url || '',
    cfWorkerDomains,
    apiKey,
    user: user.id,
  })

  return {
    success: true,
    message: 'API Key created successfully',
    key: apiKey, // Show only once
    id: newKey.id,
    links: {
      view: `/apikeys/${newKey.id}`,
      list: `/apikeys`,
    },
  }
})
