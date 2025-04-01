import { Hono } from 'hono'
import { z } from 'zod'

const VercelLogEventSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  projectId: z.string(),
  deploymentId: z.string().optional(),
  buildId: z.string().optional(),
  message: z.string(),
  source: z.string(),
  host: z.string().optional(),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  region: z.string().optional(),
  proxy: z.object({
    timestamp: z.number(),
    method: z.string(),
    scheme: z.string(),
    host: z.string(),
    path: z.string(),
    userAgent: z.string().optional(),
    referer: z.string().optional(),
    statusCode: z.number(),
    clientIp: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    duration: z.number(),
    bytes: z.number(),
  }).optional(),
  lambda: z.object({
    timestamp: z.number(),
    requestId: z.string(),
    duration: z.number(),
    maxMemoryUsed: z.number().optional(),
    initDuration: z.number().optional(),
  }).optional(),
  edge: z.object({
    timestamp: z.number(),
    requestId: z.string(),
    duration: z.number(),
    cacheStatus: z.string().optional(),
  }).optional(),
  static: z.object({
    timestamp: z.number(),
    path: z.string(),
    bytes: z.number(),
    status: z.number(),
  }).optional(),
  build: z.object({
    timestamp: z.number(),
    deploymentId: z.string(),
  }).optional(),
})

type VercelLogEvent = z.infer<typeof VercelLogEventSchema>

const app = new Hono()

app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    
    if (!Array.isArray(body)) {
      return c.json({ error: 'Invalid request body, expected an array of log events' }, 400)
    }
    
    const validEvents: VercelLogEvent[] = []
    const invalidEvents: any[] = []
    
    for (const event of body) {
      try {
        const validEvent = VercelLogEventSchema.parse(event)
        validEvents.push(validEvent)
      } catch (error) {
        invalidEvents.push({ event, error: String(error) })
      }
    }
    
    if (validEvents.length === 0) {
      return c.json({ 
        error: 'No valid log events found', 
        invalidEvents 
      }, 400)
    }
    
    await sendToClickhouse(validEvents)
    
    return c.json({ 
      success: true, 
      processed: validEvents.length,
      invalid: invalidEvents.length
    })
  } catch (error) {
    console.error('Error processing log drain events:', error)
    return c.json({ error: String(error) }, 500)
  }
})

async function sendToClickhouse(events: VercelLogEvent[]) {
  const clickhouseHost = c.env.CLICKHOUSE_HOST
  const clickhouseDb = c.env.CLICKHOUSE_DB
  const clickhouseTable = c.env.CLICKHOUSE_TABLE
  const clickhouseUser = c.env.CLICKHOUSE_USER
  const clickhousePassword = c.env.CLICKHOUSE_PASSWORD
  
  if (!clickhouseHost || !clickhouseDb || !clickhouseTable || !clickhouseUser || !clickhousePassword) {
    throw new Error('Missing Clickhouse configuration')
  }
  
  const url = `${clickhouseHost}/`
  
  const rows = events.map(event => {
    return {
      id: event.id,
      timestamp: event.timestamp,
      project_id: event.projectId,
      deployment_id: event.deploymentId || null,
      build_id: event.buildId || null,
      message: event.message,
      source: event.source,
      host: event.host || null,
      level: event.level,
      region: event.region || null,
      raw_event: JSON.stringify(event)
    }
  })
  
  const query = `
    INSERT INTO ${clickhouseDb}.${clickhouseTable} FORMAT JSONEachRow
  `
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${clickhouseUser}:${clickhousePassword}`)
    },
    body: JSON.stringify(rows),
    query: { query }
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to send data to Clickhouse: ${response.status} ${errorText}`)
  }
  
  return response
}

export default app
