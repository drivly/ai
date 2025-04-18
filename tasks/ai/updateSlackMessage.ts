import { TaskConfig } from 'payload'

interface UpdateSlackMessageInput {
  response_url: string
  blocks: any[]
  text?: string
  replace_original?: boolean
  delete_original?: boolean
}

export const updateSlackMessage = async ({ input }: { input: UpdateSlackMessageInput }): Promise<any> => {
  if (!input.response_url) {
    throw new Error('Response URL is required')
  }

  const { response_url, blocks, text = '', replace_original = true, delete_original = false } = input

  try {
    const response = await fetch(response_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks,
        text,
        replace_original,
        delete_original,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to update Slack message: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating Slack message:', error)
    throw error
  }
}

export const updateSlackMessageTask = {
  slug: 'updateSlackMessage',
  label: 'Update Slack Message',
  inputSchema: [
    { name: 'response_url', type: 'text', required: true },
    { name: 'blocks', type: 'json', required: true },
    { name: 'text', type: 'text' },
    { name: 'replace_original', type: 'checkbox' },
    { name: 'delete_original', type: 'checkbox' },
  ],
  outputSchema: [{ name: 'result', type: 'json' }],
  handler: updateSlackMessage,
} as unknown as TaskConfig
