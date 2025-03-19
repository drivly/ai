import { fromHono } from 'chanfana'
import { ChatCompletionCreate } from 'endpoints/chatCompletionCreate'
import { Hono } from 'hono'

// Start a Hono app
const app = new Hono()

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: '/',
})

// Register OpenAPI endpoints
openapi.post('/api/v1/chat/completions', ChatCompletionCreate)

// Export the Hono app
export default app
