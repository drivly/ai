import { fromHono } from 'chanfana'
import { Chat, ChatModel, ChatProviderModel } from 'endpoints/chat'
import { ChatCompletionCreate } from 'endpoints/chatCompletionCreate'
import { ModelList } from 'endpoints/modelList'
import { Hono } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { ResponseCreate } from 'endpoints/responseCreate'
import { ResponseGet } from 'endpoints/responseGet'
import { ArenaCompletion } from 'endpoints/arenaCompletion'
import { Cookies } from 'endpoints/cookies'

// Start a Hono app
const app = new Hono<{ Bindings: Cloudflare.Env }>()

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: '/',
})

// Register OpenAPI endpoints
openapi.get('/chat', Chat)
// Arena has to be above chat to prevent route collision
openapi.get('/chat/arena', ArenaCompletion)
openapi.get('/chat/:model', ChatModel)
openapi.get('/chat/:provider/:model', ChatProviderModel)
openapi.post('/api/v1/chat/completions', ChatCompletionCreate)
openapi.get('/api/v1/models', ModelList)
openapi.post('/api/v1/responses', ResponseCreate)
openapi.get('/api/v1/responses/:response_id', ResponseGet)
openapi.get('/cookies', Cookies)

// Fallbacks
app.all('/api/v1/*', async (c) => {
  const body = c.req.method === 'POST' || c.req.method === 'PUT' ? await c.req.json() : undefined
  return await fetchFromProvider({ body, headers: { Authorization: c.req.header('Authorization') } }, c.req.method, c.req.path.replace('/api/v1', ''))
})

app.all('*', (c) => c.json({ error: 'Not found' }, 404))

// Export the Hono app
export default app
