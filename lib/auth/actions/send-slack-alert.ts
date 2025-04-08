'use server'

import { objectEntries } from '@/lib/utils'

type SlackBlocks = Array<ReturnType<typeof createSlackSection> | { type: 'divider' }>

function createSlackSection(text: string) {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  }
}

function formatDetailValue(value: any) {
  if (typeof value === 'bigint') {
    return value.toString() // Convert BigInt to string
  }
  if (Array.isArray(value)) {
    return value.join('\n')
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2) // Pretty-print for nested objects
  }
  return String(value)
}

export async function sendSlackAlert(message: string, details: Record<string, any>) {
  const webhookUrl = process.env.WAITLIST_DO_SLACK_URL

  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not configured.')
    return
  }

  const blocks: SlackBlocks = []

  const detailsMessage = objectEntries(details)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `*${key}:* ${formatDetailValue(value)}`)
    .join('\n')

  blocks.push(createSlackSection(message))
  blocks.push(createSlackSection(detailsMessage))
  blocks.push({ type: 'divider' })

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify({ blocks }),
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending Slack message: ', error)
  }
}
