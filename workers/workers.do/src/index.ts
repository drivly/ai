import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Env {
  CF_ACCOUNT_ID: string
  CF_API_TOKEN: string
  CF_NAMESPACE_ID: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

app.get('/', async (c) => {
  const url = new URL(c.req.url)
  const hostname = url.hostname
  
  const subdomain = hostname.split('.')[0]
  
  if (!subdomain || subdomain === 'workers') {
    return c.json({
      name: 'Workers.do',
      description: 'Cloudflare Workers for Platforms Dispatch Worker',
      documentation: 'https://workers.do/docs',
      version: '1.0.0'
    })
  }
  
  try {
    const scriptResponse = fetch(`https://api.cloudflare.com/client/v4/accounts/${c.env.CF_ACCOUNT_ID}/workers/dispatch/namespaces/${c.env.CF_NAMESPACE_ID}/scripts/${subdomain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${c.env.CF_API_TOKEN}`,
      },
    })
    
    const moduleExportsResponse = fetch(`https://${subdomain}.${c.env.CF_NAMESPACE_ID}.workers.dev/__worker_introspect`, {
      headers: {
        'X-Worker-Introspect': 'true'
      }
    })
    
    const [scriptCheck, moduleExports] = await Promise.all([scriptResponse, moduleExportsResponse])
    
    if (!scriptCheck.ok) {
      return c.json({
        error: `Worker not found: ${subdomain}`,
        status: 404
      }, 404)
    }
    
    if (!moduleExports.ok) {
      return c.json({
        error: `Failed to introspect worker: ${subdomain}`,
        status: moduleExports.status
      }, 500)
    }
    
    const exports = await moduleExports.json() as Record<string, { 
      type: string, 
      examples?: Array<{ id: number, description: string, input: string, expectedOutput: string }> 
    }>
    
    const baseUrl = `https://${subdomain}.workers.do`
    const exportLinks = Object.keys(exports).map(exportName => {
      const exportType = exports[exportName].type
      return {
        name: exportName,
        type: exportType,
        url: `${baseUrl}/${exportName}`,
        ...(exportType === 'function' && exports[exportName].examples ? {
          examples: exports[exportName].examples.map((example: { id: number, description: string, input: string, expectedOutput: string }) => ({
            ...example,
            url: `${baseUrl}/${exportName}/examples/${example.id}`
          }))
        } : {})
      }
    })
    
    return c.json({
      name: subdomain,
      exports: exportLinks,
      documentation: `${baseUrl}/docs`
    })
  } catch (error) {
    console.error('Error fetching module exports:', error)
    return c.json({
      error: 'Internal server error',
      status: 500
    }, 500)
  }
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
    
    const outboundContext = {
      userWorkerName: subdomain,
      originalUrl: url.toString(),
    }
    
    const workerResponse = await fetch(url.toString(), {
      method: c.req.method,
      headers: c.req.header(),
      body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? await c.req.arrayBuffer() : undefined,
      cf: {
        outbound: {
          service: "workers-do-outbound",
          params_object: outboundContext
        }
      }
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
