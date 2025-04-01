import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Env {
  CF_ACCOUNT_ID: string
  CF_API_TOKEN: string
  CF_NAMESPACE_ID: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Workers.do - Cloudflare Workers for Platforms Dispatch Worker')
})

app.all('*', async (c) => {
  const url = new URL(c.req.url)
  const hostname = url.hostname
  
  const subdomain = hostname.split('.')[0]
  
  if (!subdomain || subdomain === 'workers') {
    return c.text('Invalid subdomain', 400)
  }
  
  try {
    const scriptResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${c.env.CF_ACCOUNT_ID}/workers/dispatch/namespaces/${c.env.CF_NAMESPACE_ID}/scripts/${subdomain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${c.env.CF_API_TOKEN}`,
      },
    })
    
    if (!scriptResponse.ok) {
      return c.text(`Worker not found: ${subdomain}`, 404)
    }
    
    const workerResponse = await fetch(url.toString(), {
      method: c.req.method,
      headers: c.req.header(),
      body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? await c.req.arrayBuffer() : undefined,
    })
    
    return new Response(workerResponse.body, {
      status: workerResponse.status,
      statusText: workerResponse.statusText,
      headers: workerResponse.headers,
    })
  } catch (error) {
    console.error('Error dispatching request:', error)
    return c.text('Internal server error', 500)
  }
})

export default app
