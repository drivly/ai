import { Hono } from 'hono'

interface Env {
  userWorkerName: string
  originalUrl: string
}

const app = new Hono<{ Bindings: Env }>()

app.all('*', async (c) => {
  const userWorkerName = c.env.userWorkerName
  const originalUrl = c.env.originalUrl
  const requestUrl = c.req.url
  
  try {
    const logEvent = fetch('https://apis.do/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'worker.outbound.request',
        source: 'workers.do',
        data: {
          userWorkerName,
          originalUrl,
          requestUrl,
          method: c.req.method,
          headers: Object.fromEntries(new Headers(c.req.header()).entries()),
        },
        metadata: {
          timestamp: new Date().toISOString(),
        }
      }),
    }).catch(error => {
      console.error('Error logging outbound request:', error)
    })
    
    const headers = new Headers(c.req.header())
    headers.set('X-User-Worker-Name', userWorkerName)
    
    const request = new Request(c.req.url, {
      method: c.req.method,
      headers,
      body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? await c.req.arrayBuffer() : undefined,
    })
    
    const response = await fetch(request)
    
    try {
      if (c.executionCtx) {
        c.executionCtx.waitUntil(logEvent)
      }
    } catch (waitUntilError) {
      console.error('Error with waitUntil:', waitUntilError)
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Error in outbound worker:', error)
    
    try {
      if (c.executionCtx) {
        c.executionCtx.waitUntil(
          fetch('https://apis.do/api/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'worker.outbound.error',
              source: 'workers.do',
              data: {
                userWorkerName,
                originalUrl,
                requestUrl,
                error: error instanceof Error ? error.message : String(error),
              },
              metadata: {
                timestamp: new Date().toISOString(),
              }
            }),
          }).catch(err => {
            console.error('Error logging outbound error:', err)
          })
        )
      }
    } catch (waitUntilError) {
      console.error('Error with waitUntil for error logging:', waitUntilError)
    }
    
    return new Response('Error processing outbound request', { status: 500 })
  }
})

export default app
