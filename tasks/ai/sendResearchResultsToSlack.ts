import { TaskConfig } from 'payload'

interface SendResearchResultsToSlackInput {
  channel: string
  threadTs: string | null
  responseTs: string
  results: {
    summary?: string | null
    findings?: { finding?: string | null; id?: string | null }[] | null
    sources?: { sourceUrl?: string | null; id?: string | null }[] | null
    confidence?: number | null
  }
  query: string
}

export const sendResearchResultsToSlack = async ({ input }: { input: SendResearchResultsToSlackInput }): Promise<any> => {
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is not configured')
  }

  const { channel, threadTs, responseTs, results, query } = input

  try {
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:white_check_mark: Research results for *${query}*`,
        },
      },
      {
        type: 'divider',
      },
    ]

    if (results.summary) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Summary:*\n${results.summary}`,
        },
      })
    }

    if (results.findings && results.findings.length > 0) {
      const findingsText = results.findings
        .filter(f => f && f.finding)
        .map((f, idx) => `${idx + 1}. ${f.finding}`)
        .join('\n')

      if (findingsText) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Key Findings:*\n${findingsText}`,
          },
        })
      }
    }

    if (results.sources && results.sources.length > 0) {
      const sourcesText = results.sources
        .filter(s => s && s.sourceUrl)
        .map((s, idx) => `${idx + 1}. <${s.sourceUrl}|Source ${idx + 1}>`)
        .join('\n')

      if (sourcesText) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Sources:*\n${sourcesText}`,
          },
        })
      }
    }

    if (results.confidence !== null && results.confidence !== undefined) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Confidence:* ${Math.round(results.confidence * 100)}%`,
          } as any,
        ],
      } as any)
    }

    const response = await fetch('https://slack.com/api/chat.update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel,
        ts: responseTs,
        blocks,
        text: `Research results for "${query}"`,
      }),
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(`Failed to update Slack message: ${data.error}`)
    }

    return data
  } catch (error) {
    console.error('Error sending research results to Slack:', error)
    throw error
  }
}

export const sendResearchResultsToSlackTask = {
  slug: 'sendResearchResultsToSlack',
  label: 'Send Research Results to Slack',
  inputSchema: [
    { name: 'channel', type: 'text', required: true },
    { name: 'threadTs', type: 'text' },
    { name: 'responseTs', type: 'text', required: true },
    { name: 'results', type: 'json', required: true },
    { name: 'query', type: 'text', required: true },
  ],
  outputSchema: [{ name: 'result', type: 'json' }],
  handler: sendResearchResultsToSlack,
} as unknown as TaskConfig
