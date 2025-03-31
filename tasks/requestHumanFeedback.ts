import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

type MessagePlatform = 'slack' | 'teams' | 'discord'

interface ResponseOption {
  value: string
  label: string
}

interface SlackBlock {
  type: string
  [key: string]: any
}

interface TeamsCard {
  type: string
  $schema: string
  version: string
  body: any[]
  actions: any[]
}

interface DiscordEmbed {
  title: string
  description: string
  color: number
  fields: { name: string; value: string }[]
  footer?: { text: string }
}

interface HumanFeedbackRequest {
  taskId?: string
  title: string
  description: string
  options?: ResponseOption[]
  freeText?: boolean
  platform?: MessagePlatform
  userId?: string
  roleId?: string
  timeout?: number
}

interface HumanFeedbackResponse {
  taskId: string
  status: 'pending' | 'completed' | 'timeout'
  response?: {
    selectedOption?: string
    freeText?: string
  }
  messageId?: {
    slack?: string
    teams?: string
    discord?: string
  }
}

/**
 * Send a message to a human via Slack, Teams, or Discord and wait for their response
 */
export const requestHumanFeedback = async ({ 
  input, 
  payload 
}: { 
  input: HumanFeedbackRequest, 
  payload: any 
}): Promise<HumanFeedbackResponse> => {
  const { 
    taskId: existingTaskId, 
    title, 
    description, 
    options = [], 
    freeText = false, 
    platform = 'slack', 
    userId, 
    roleId,
    timeout = 3600000 // Default timeout: 1 hour
  } = input

  let task
  if (existingTaskId) {
    try {
      task = await payload.findByID({
        collection: 'tasks',
        id: existingTaskId
      })
    } catch (error) {
      console.error('Task not found, creating new task', error)
    }
  }

  if (!task) {
    task = await payload.create({
      collection: 'tasks',
      data: {
        title,
        description,
        status: 'todo',
        assigned: userId ? [{ relationTo: 'users', value: userId }] : 
                 roleId ? [{ relationTo: 'roles', value: roleId }] : undefined,
      }
    })
  }

  await payload.update({
    collection: 'tasks',
    id: task.id,
    data: {
      status: 'in-progress',
      description: description || task.description,
      metadata: {
        type: 'human-feedback',
        options,
        freeText,
        platform,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + timeout).toISOString()
      }
    }
  })

  const messageId = await sendPlatformMessage(platform, {
    taskId: task.id,
    title,
    description,
    options,
    freeText,
    userId,
    roleId
  })

  waitUntil(
    new Promise(resolve => {
      setTimeout(async () => {
        const currentTask = await payload.findByID({
          collection: 'tasks',
          id: task.id
        })
        
        if (currentTask.status === 'in-progress') {
          await payload.update({
            collection: 'tasks',
            id: task.id,
            data: {
              status: 'completed',
              metadata: {
                ...currentTask.metadata,
                timedOut: true,
                completedAt: new Date().toISOString()
              }
            }
          })
        }
        resolve(true)
      }, timeout)
    })
  )

  return {
    taskId: task.id,
    status: 'pending',
    messageId: {
      [platform]: messageId
    }
  }
}

/**
 * Send a message to the specified platform
 */
async function sendPlatformMessage(
  platform: MessagePlatform,
  {
    taskId,
    title,
    description,
    options,
    freeText,
    userId,
    roleId
  }: Omit<HumanFeedbackRequest, 'platform' | 'timeout'> & { taskId: string }
): Promise<string> {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ai.driv.ly'
  const callbackUrl = `${origin}/api/webhooks/human-feedback?taskId=${taskId}`

  switch (platform) {
    case 'slack':
      return await sendSlackMessage({
        taskId,
        title,
        description,
        options,
        freeText,
        callbackUrl,
        userId,
        roleId
      })
    case 'teams':
      return await sendTeamsMessage({
        taskId,
        title,
        description,
        options,
        freeText,
        callbackUrl,
        userId,
        roleId
      })
    case 'discord':
      return await sendDiscordMessage({
        taskId,
        title,
        description,
        options,
        freeText,
        callbackUrl,
        userId,
        roleId
      })
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

/**
 * Send a message to Slack
 */
async function sendSlackMessage({
  taskId,
  title,
  description,
  options,
  freeText,
  callbackUrl,
  userId,
  roleId
}: Omit<HumanFeedbackRequest, 'platform' | 'timeout'> & { 
  taskId: string,
  callbackUrl: string 
}): Promise<string> {
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is not configured')
  }

  let channel = process.env.SLACK_DEFAULT_CHANNEL || 'general'
  
  if (userId) {
  }

  if (roleId) {
  }

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: title,
        emoji: true
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: description
      }
    },
    {
      type: 'divider'
    }
  ]

  if (options && options.length > 0) {
    const actionBlock: SlackBlock = {
      type: 'actions',
      elements: options.map(option => ({
        type: 'button',
        text: {
          type: 'plain_text',
          text: option.label,
          emoji: true
        },
        value: `${taskId}:${option.value}`,
        action_id: `human_feedback_option:${option.value}`
      }))
    }
    blocks.push(actionBlock)
  }

  if (freeText) {
    blocks.push({
      type: 'input',
      block_id: `human_feedback_text:${taskId}`,
      label: {
        type: 'plain_text',
        text: 'Your response',
        emoji: true
      },
      element: {
        type: 'plain_text_input',
        action_id: 'human_feedback_text_input',
        multiline: true
      }
    } as SlackBlock)

    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true
          },
          value: taskId,
          action_id: 'human_feedback_submit'
        }
      ]
    } as SlackBlock)
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel,
        blocks,
        text: title // Fallback text
      })
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(`Failed to send Slack message: ${data.error}`)
    }

    return data.ts // Return the message timestamp as the ID
  } catch (error) {
    console.error('Error sending Slack message:', error)
    throw error
  }
}

/**
 * Send a message to Microsoft Teams
 */
async function sendTeamsMessage({
  taskId,
  title,
  description,
  options,
  freeText,
  callbackUrl,
  userId,
  roleId
}: Omit<HumanFeedbackRequest, 'platform' | 'timeout'> & { 
  taskId: string,
  callbackUrl: string 
}): Promise<string> {
  if (!process.env.TEAMS_WEBHOOK_URL) {
    throw new Error('TEAMS_WEBHOOK_URL is not configured')
  }

  const card: TeamsCard = {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.3',
    body: [
      {
        type: 'TextBlock',
        size: 'Medium',
        weight: 'Bolder',
        text: title
      },
      {
        type: 'TextBlock',
        text: description,
        wrap: true
      }
    ],
    actions: []
  }

  if (options && options.length > 0) {
    options.forEach(option => {
      card.actions.push({
        type: 'Action.Submit',
        title: option.label,
        data: {
          taskId,
          option: option.value
        }
      } as any)
    })
  }

  if (freeText) {
    card.body.push({
      type: 'Input.Text',
      id: 'feedbackText',
      placeholder: 'Enter your response',
      isMultiline: true
    } as any)

    card.actions.push({
      type: 'Action.Submit',
      title: 'Submit',
      data: {
        taskId,
        type: 'freeText'
      }
    } as any)
  }

  try {
    const response = await fetch(process.env.TEAMS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'message',
        attachments: [
          {
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: card
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send Teams message: ${errorText}`)
    }

    return `teams-${taskId}-${Date.now()}`
  } catch (error) {
    console.error('Error sending Teams message:', error)
    throw error
  }
}

/**
 * Send a message to Discord
 */
async function sendDiscordMessage({
  taskId,
  title,
  description,
  options,
  freeText,
  callbackUrl,
  userId,
  roleId
}: Omit<HumanFeedbackRequest, 'platform' | 'timeout'> & { 
  taskId: string,
  callbackUrl: string 
}): Promise<string> {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    throw new Error('DISCORD_WEBHOOK_URL is not configured')
  }

  const embed: DiscordEmbed = {
    title,
    description,
    color: 0x0099ff,
    fields: [],
    footer: {
      text: `Task ID: ${taskId}`
    }
  }

  if (options && options.length > 0) {
    embed.fields.push({
      name: 'Options',
      value: options.map((option, index) => 
        `${index + 1}. ${option.label} - \`/human-feedback ${taskId} option ${option.value}\``
      ).join('\n')
    })
  }

  if (freeText) {
    embed.fields.push({
      name: 'Free Text Response',
      value: `Use \`/human-feedback ${taskId} text Your response here\` to submit your feedback.`
    })
  }

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send Discord message: ${errorText}`)
    }

    const data = await response.json()
    return data.id // Discord message ID
  } catch (error) {
    console.error('Error sending Discord message:', error)
    throw error
  }
}

/**
 * Process a response from a human
 */
export const processHumanFeedbackResponse = async ({
  taskId,
  option,
  text,
  platform
}: {
  taskId: string,
  option?: string,
  text?: string,
  platform: MessagePlatform
}, payload: any): Promise<void> => {
  const task = await payload.findByID({
    collection: 'tasks',
    id: taskId
  })

  if (!task) {
    throw new Error(`Task not found: ${taskId}`)
  }

  await payload.update({
    collection: 'tasks',
    id: taskId,
    data: {
      status: 'completed',
      metadata: {
        ...task.metadata,
        response: {
          selectedOption: option,
          freeText: text
        },
        respondedVia: platform,
        completedAt: new Date().toISOString()
      }
    }
  })
}

export const requestHumanFeedbackTask = {
  slug: 'requestHumanFeedback',
  label: 'Request Human Feedback',
  inputSchema: [
    { name: 'taskId', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'text', required: true },
    { name: 'options', type: 'json' },
    { name: 'freeText', type: 'checkbox' },
    { name: 'platform', type: 'select', options: ['slack', 'teams', 'discord'] },
    { name: 'userId', type: 'text' },
    { name: 'roleId', type: 'text' },
    { name: 'timeout', type: 'number' }
  ],
  outputSchema: [
    { name: 'taskId', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'response', type: 'json' },
    { name: 'messageId', type: 'json' }
  ],
  handler: requestHumanFeedback,
} as unknown as TaskConfig
