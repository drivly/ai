'use server'

import { objectEntries } from '@/lib/utils'
import { CareerApplicationDetails } from './shared-params'

// Block types
type SlackBlockType = 'section' | 'context' | 'header' | 'divider' | 'image'

interface SlackBlock {
  type: SlackBlockType
  [key: string]: any
}

// Block builders
const SlackBlocks = {
  section: (text: string, accessory?: any): SlackBlock => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
    ...(accessory && { accessory }),
  }),

  context: (elements: any[]): SlackBlock => ({
    type: 'context',
    elements,
  }),

  header: (text: string): SlackBlock => ({
    type: 'header',
    text: {
      type: 'plain_text',
      text,
      emoji: true,
    },
  }),

  divider: (): SlackBlock => ({ type: 'divider' }),

  image: (imageUrl: string, altText: string): SlackBlock => ({
    type: 'image',
    image_url: imageUrl,
    alt_text: altText,
  }),

  // Helper for context block elements
  contextImage: (imageUrl: string, altText = 'Image') => ({
    type: 'image',
    image_url: imageUrl,
    alt_text: altText,
  }),

  contextText: (text: string) => ({
    type: 'mrkdwn',
    text,
  }),
}

// Formatter utils
function formatValue(value: any): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'bigint') return value.toString()
  if (Array.isArray(value)) return value.join('\n')
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function formatKeyValuePairs(details: Record<string, any>): string {
  return objectEntries(details)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `*${key}:* ${formatValue(value)}`)
    .join('\n')
}

// Message templates
interface SlackMessageTemplate {
  getBlocks: (data: any) => SlackBlock[]
}

// Webhook configuration
interface WebhookConfig {
  url: string | undefined
  defaultTitle?: string
}

const webhooks: Record<string, WebhookConfig> = {
  waitlist: {
    url: process.env.WAITLIST_DO_SLACK_URL,
    defaultTitle: 'New Waitlist Signup',
  },
  careers: {
    url: process.env.CAREERS_DO_SLACK_URL,
    defaultTitle: 'New Job Application',
  },
}

// Generic send function
async function sendSlackMessage(webhookUrl: string | undefined, blocks: SlackBlock[]): Promise<boolean> {
  if (!webhookUrl) {
    console.error('Slack webhook URL is not configured.')
    return false
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify({ blocks }),
      headers: { 'Content-Type': 'application/json' },
    })
    return true
  } catch (error) {
    console.error('Error sending Slack message: ', error)
    return false
  }
}

// Simple message template
const SimpleAlertTemplate: SlackMessageTemplate = {
  getBlocks: (data: { title: string; details: Record<string, any> }) => [
    SlackBlocks.section(data.title),
    SlackBlocks.section(formatKeyValuePairs(data.details)),
    SlackBlocks.divider(),
  ],
}

// Career application template
const CareerApplicationTemplate: SlackMessageTemplate = {
  getBlocks: (application: CareerApplicationDetails) => {
    const blocks: SlackBlock[] = [
      SlackBlocks.header(`New Application: ${application.position}`),
      SlackBlocks.section(`*<${application.githubProfile}|${application.name}>* has applied for the *${application.position}* position.`),
      SlackBlocks.context([
        ...(application.avatarUrl ? [SlackBlocks.contextImage(application.avatarUrl, 'Profile image')] : []),
        SlackBlocks.contextText(`Email: ${application.email}`),
      ]),
    ]

    // Add bio if available
    if (application.bio) {
      blocks.push(SlackBlocks.section(`>_${application.bio}_`))
    }

    // Add GitHub stats
    const statsText = [
      application.location ? `*Location:* ${application.location}` : '',
      application.followers !== undefined ? `*GitHub Followers:* ${application.followers}` : '',
      application.publicRepos !== undefined ? `*Public Repos:* ${application.publicRepos}` : '',
    ]
      .filter(Boolean)
      .join(' | ')

    if (statsText) {
      blocks.push(SlackBlocks.section(statsText))
    }

    blocks.push(SlackBlocks.divider())
    blocks.push(SlackBlocks.section(`<!here> New application received from careers.do`))

    return blocks
  },
}

// Public API
export async function sendSlackAlert(channel: keyof typeof webhooks, details: Record<string, any>) {
  const { url, defaultTitle } = webhooks[channel]
  const title = details.title || defaultTitle || `New Alert from ${channel}`

  // Remove title from details if it was used
  if (details.title) {
    const { title: _, ...restDetails } = details
    details = restDetails
  }

  const blocks = SimpleAlertTemplate.getBlocks({ title, details })
  return sendSlackMessage(url, blocks)
}

export async function sendCareerSlackAlert(application: CareerApplicationDetails) {
  const webhookUrl = webhooks.careers.url
  const blocks = CareerApplicationTemplate.getBlocks(application)
  return sendSlackMessage(webhookUrl, blocks)
}

// Generic function to send custom messages with any template
export async function sendTemplatedMessage<T>(channel: keyof typeof webhooks, template: SlackMessageTemplate, data: T): Promise<boolean> {
  const webhookUrl = webhooks[channel].url
  const blocks = template.getBlocks(data)
  return sendSlackMessage(webhookUrl, blocks)
}
