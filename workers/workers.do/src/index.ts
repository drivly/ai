import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Agent } from 'agents'

interface Env {
  CF_ACCOUNT_ID: string
  CF_API_TOKEN: string
  CF_NAMESPACE_ID: string
  OPENAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
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
      version: '1.0.0',
      features: ['agents']
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

app.post('/deploy/agent/:id', async (c) => {
  const agentId = c.req.param('id')
  
  if (!agentId) {
    return c.json({ error: 'Agent ID is required' }, 400)
  }
  
  try {
    const agentResponse = await fetch(`https://apis.do/api/agents/${agentId}`, {
      headers: {
        'Authorization': `Bearer ${c.env.CF_API_TOKEN}`,
      },
    })
    
    if (!agentResponse.ok) {
      return c.json({ 
        error: `Failed to fetch agent: ${agentId}`,
        status: agentResponse.status 
      }, 404)
    }
    
    const agentData = await agentResponse.json()
    
    const agent = new Agent({
      name: agentData.name,
      instructions: agentData.systemPrompt || agentData.description,
      model: agentData.baseModel || 'openai/gpt-4',
      apiKey: c.env.OPENAI_API_KEY || c.env.ANTHROPIC_API_KEY,
    })
    
    const deployResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${c.env.CF_ACCOUNT_ID}/workers/dispatch/namespaces/${c.env.CF_NAMESPACE_ID}/scripts/${agentData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${c.env.CF_API_TOKEN}`,
        'Content-Type': 'application/javascript',
      },
      body: `
        import { Agent } from 'agents'
        
        export default {
          async fetch(request, env) {
            const agent = new Agent({
              name: "${agentData.name}",
              instructions: "${agentData.systemPrompt || agentData.description || ''}",
              model: "${agentData.baseModel || 'openai/gpt-4'}",
              apiKey: env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY,
            })
            
            try {
              const url = new URL(request.url)
              const message = url.searchParams.get('message') || ''
              
              if (!message) {
                return new Response(JSON.stringify({
                  error: 'Message parameter is required'
                }), { 
                  status: 400,
                  headers: { 'Content-Type': 'application/json' }
                })
              }
              
              const response = await agent.chat(message)
              
              return new Response(JSON.stringify({
                response,
                agent: "${agentData.name}"
              }), { 
                headers: { 'Content-Type': 'application/json' }
              })
            } catch (error) {
              return new Response(JSON.stringify({
                error: error.message
              }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
              })
            }
          }
        }
      `
    })
    
    if (!deployResponse.ok) {
      const errorData = await deployResponse.json()
      return c.json({ 
        error: 'Failed to deploy agent',
        details: errorData
      }, 500)
    }
    
    const deployResult = await deployResponse.json()
    
    return c.json({
      success: true,
      agent: {
        id: agentId,
        name: agentData.name,
        url: `https://${agentData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.workers.do`
      },
      deployment: deployResult
    })
  } catch (error) {
    console.error('Error deploying agent:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
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
