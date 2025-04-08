import { fromHono } from 'chanfana'
import { ArenaCompletion } from 'endpoints/arenaCompletion'
import { Chat, ChatModel, ChatProviderModel } from 'endpoints/chat'
import { ChatCompletionCreate } from 'endpoints/chatCompletionCreate'
import { Cookies } from 'endpoints/cookies'
import { ModelList } from 'endpoints/modelList'
import { ResponseCreate } from 'endpoints/responseCreate'
import { Hono } from 'hono'
import { providers } from 'providers/provider'

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
openapi.get('/cookies', Cookies)

// Fallbacks
app.all('/api/v1/*', async (c) => {
  const body = c.req.method === 'POST' || c.req.method === 'PUT' ? await c.req.json() : undefined
  return await providers.default.fetchFromProvider({ body, headers: { Authorization: c.req.header('Authorization') } }, c.req.method, c.req.path.replace('/api/v1', ''))
})

app.all('*', (c) => c.json({ error: 'Not found' }, 404))

// Export the Hono app
export default app
