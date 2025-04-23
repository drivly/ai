import { NextRequest, NextResponse } from 'next/server.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { waitUntil } from '@vercel/functions'

async function verifySlackRequest(request: NextRequest): Promise<boolean> {
  try {
    const body = await request.text()
    const timestamp = request.headers.get('x-slack-request-timestamp')
    const signature = request.headers.get('x-slack-signature')
    const signingSecret = process.env.SLACK_SIGNING_SECRET

    if (!timestamp || !signature || !signingSecret) {
      return false
    }

    const currentTime = Math.floor(Date.now() / 1000)
    if (Math.abs(currentTime - parseInt(timestamp, 10)) > 60 * 5) {
      return false
    }

    const baseString = `v0:${timestamp}:${body}`

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(signingSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])

    const signatureToVerify = await crypto.subtle.sign('HMAC', key, encoder.encode(baseString))

    const signatureHex =
      'v0=' +
      Array.from(new Uint8Array(signatureToVerify))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    return signature === signatureHex
  } catch (error) {
    console.error('Error verifying Slack request:', error)
    return false
  }
}

/**
 * Extract the research query from the mention text
 * Format: "@research.do Research about <topic>"
 */
function extractResearchQuery(text: string): string | null {
  const mentionRegex = /<@[A-Z0-9]+>/
  const cleanedText = text.replace(mentionRegex, '').trim()
  
  if (!cleanedText) {
    return null
  }
  
  const researchPrefixRegex = /^research(\s+about)?\s+/i
  const query = cleanedText.replace(researchPrefixRegex, '').trim()
  
  return query || cleanedText // Return the cleaned query or the original cleaned text
}

/**
 * Send an acknowledgment message to the Slack channel
 */
async function sendAcknowledgmentMessage(channel: string, threadTs: string | null, query: string): Promise<string> {
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is not configured')
  }

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:mag: I'm researching *${query}* for you. This may take a few moments...`,
      },
    },
  ]

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel,
      thread_ts: threadTs,
      blocks,
      text: `Researching "${query}"...`, // Fallback text
    }),
  })

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Failed to send Slack message: ${data.error}`)
  }

  return data.ts // Return the message timestamp
}

/**
 * Process the research request
 */
async function processResearchRequest(
  query: string, 
  channel: string, 
  threadTs: string | null, 
  responseTs: string,
  payload: any
): Promise<void> {
  try {
    const task = await payload.create({
      collection: 'tasks',
      data: {
        status: 'queued',
        type: 'research',
        input: { 
          topic: query, 
          depth: 'medium', 
          format: 'markdown',
          slackChannel: channel,
          slackThreadTs: threadTs,
          slackResponseTs: responseTs,
        },
      },
    })

    const job = await payload.jobs.queue({
      task: 'researchTask',
      input: { 
        topic: query, 
        depth: 'medium', 
        format: 'markdown', 
        taskId: task.id,
        slackChannel: channel,
        slackThreadTs: threadTs,
        slackResponseTs: responseTs,
      },
    })

    console.log(`Research job queued: ${job.id} for task: ${task.id}, query: "${query}" in channel: ${channel}`)
  } catch (error) {
    console.error('Error processing research request:', error)
    
    try {
      await payload.jobs.queue({
        task: 'updateSlackMessage',
        input: {
          channel,
          ts: responseTs,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `:x: Sorry, I encountered an error while processing your research request. Please try again later.`,
              },
            },
          ],
          text: 'Error processing research request',
          replace_original: true,
        },
      })
    } catch (updateError) {
      console.error('Error sending error message to Slack:', updateError)
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const clonedReq = req.clone()
    const rawBody = await clonedReq.text()

    const isValid = await verifySlackRequest(req)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Slack signature' }, { status: 401 })
    }

    let payload
    try {
      payload = await getPayload({ config })
    } catch (error) {
      console.error('Error getting payload instance:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    let eventPayload
    try {
      eventPayload = JSON.parse(rawBody)
    } catch (error) {
      console.error('Error parsing event payload:', error)
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    if (eventPayload.type === 'url_verification') {
      return NextResponse.json({ challenge: eventPayload.challenge })
    }

    if (eventPayload.event && eventPayload.event.type === 'app_mention') {
      const event = eventPayload.event
      const text = event.text
      const channel = event.channel
      const threadTs = event.thread_ts || event.ts // Use thread_ts if available, otherwise use the message ts
      
      const query = extractResearchQuery(text)
      
      if (!query) {
        console.log('No research query found in the mention text:', text)
        
        const helpResponse = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          },
          body: JSON.stringify({
            channel,
            thread_ts: threadTs,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:wave: Hi there! To use me, mention me followed by your research query. For example: "@research.do Research about climate change"`,
                },
              },
            ],
            text: 'Research.do help',
          }),
        })
        
        return NextResponse.json({ success: true })
      }
      
      const responseTs = await sendAcknowledgmentMessage(channel, threadTs, query)
      
      waitUntil(
        processResearchRequest(query, channel, threadTs, responseTs, payload)
      )
      
      return NextResponse.json({ success: true })
    }
    
    console.log('Unsupported event type:', eventPayload)
    return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 })
    
  } catch (error) {
    console.error('Error processing Slack mention:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
