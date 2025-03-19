import { fromHono } from 'chanfana'
import { ChatCompletionCreate } from 'endpoints/chatCompletionCreate'
import { ModelList } from 'endpoints/modelList'
import { Hono } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'

// Start a Hono app
const app = new Hono()

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: '/',
})

// Register OpenAPI endpoints
openapi.get('/api/v1/models', ModelList)
openapi.post('/api/v1/chat/completions', ChatCompletionCreate)

// Fallbacks
app.all('/api/v1/*', async (c) => {
  const body = c.req.method === 'POST' || c.req.method === 'PUT' ? await c.req.json() : undefined
  const r = await fetchFromProvider({ body, headers: { Authorization: c.req.header('Authorization') } }, c.req.method, c.req.path.replace('/api/v1', ''))
  const json = await r.json()
  return c.json<any>(json)
})

app.all('*', (c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Export the Hono app
export default app
