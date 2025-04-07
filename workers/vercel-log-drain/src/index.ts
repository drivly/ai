import { Hono } from 'hono'

type VercelLogEvent = {
  id: string
  timestamp: number
  projectId: string
  [key: string]: any
}

const app = new Hono()

app.post('/', async (c) => {
  try {
    const body = await c.req.json()

    if (!Array.isArray(body)) {
      return c.json({ error: 'Invalid request body, expected an array of log events' }, 400)
    }

    await sendToClickhouse(c, body)

    return c.json({
      success: true,
      processed: body.length,
    })
  } catch (error) {
    console.error('Error processing log drain events:', error)
    return c.json({ error: String(error) }, 500)
  }
})

async function sendToClickhouse(c: any, events: VercelLogEvent[]) {
  const clickhouseHost = c.env.CLICKHOUSE_HOST
  const clickhouseDb = c.env.CLICKHOUSE_DB
  const clickhouseTable = c.env.CLICKHOUSE_TABLE
  const clickhouseUser = c.env.CLICKHOUSE_USER
  const clickhousePassword = c.env.CLICKHOUSE_PASSWORD

  if (!clickhouseHost || !clickhouseDb || !clickhouseTable || !clickhouseUser || !clickhousePassword) {
    throw new Error('Missing Clickhouse configuration')
  }

  const url = `${clickhouseHost}/`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${clickhouseUser}:${clickhousePassword}`),
    },
    body: JSON.stringify(events),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to send data to Clickhouse: ${response.status} ${errorText}`)
  }

  return response
}

export default app
