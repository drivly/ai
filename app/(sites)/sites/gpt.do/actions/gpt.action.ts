'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject, generateText, type UIMessage } from 'ai'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'
import type { ConfigOption } from '../components/chat-options-selector'
import { COOKIE_MAX_AGE, GPTDO_BRAIN_COOKIE, GPTDO_COOKIE_MAP, GPTDO_OUTPUT_COOKIE, GPTDO_TOOLBELT_COOKIE } from '../lib/constants'
import type { SearchOption } from '../lib/types'

const promptSuggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        label: z.string().describe('A short, descriptive label for the suggestion category'),
        action: z.string().describe('The actual suggestion text that will be shown to the user and used as the prompt'),
      }),
    )
    .describe('An array of prompt suggestions customized for the selected tool and output format'),
})

export async function getPromptSuggestions({ integrationName, output, actionValue }: { integrationName?: string; output?: string; actionValue?: string }) {
  try {
    let action = actionValue
    let baseToolValue = integrationName

    if (integrationName && integrationName.includes('.')) {
      const [tool, extractedAction] = integrationName.split('.')
      baseToolValue = tool
      action = action || extractedAction
    }

    const {
      object: { suggestions },
    } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: promptSuggestionSchema,
      system: `You are an AI assistant that generates helpful prompt suggestions based on user's selected tool and output format.
      Generate 8-12 creative, specific, and useful prompt suggestions that are relevant to the selected tool, action, and output format.
      The suggestions should help users get started with their tasks and showcase the capabilities of the AI.
      
      Each suggestion should have:
      1. A descriptive label (category) - keep it to 1-2 words
      2. An action text (the actual suggestion) - MUST be extremely concise (3-5 words)
      
      IMPORTANT: Actions must be very short (3-5 words maximum). For example:
      - "Tokyo 3-day itinerary" 
      - "Smart water bottle pitch"
      - "Express.js API example"
      - "Client meeting request"

      Do not use full sentences. Keep actions extremely brief but clear.
      Make suggestions specific to the tool's capabilities, selected action, and the chosen output format.`,
      prompt: `Generate prompt suggestions for the following configuration:
      ${baseToolValue ? `Tool: ${baseToolValue}` : 'No specific tool selected'}
      ${action ? `Action: ${action}` : 'No specific action selected'}
      ${output ? `Output Format: ${output}` : 'No specific output format selected'}

      Create suggestions that would be useful for this combination. If a specific action is selected, focus suggestions specifically on that action within the tool.
      If no specific action is selected, provide suggestions suitable for the general tool.`,
    })

    return suggestions
  } catch (error) {
    console.error('Failed to generate suggestions:', error)
    throw error
  }
}

export async function generateTitleFromUserMessage({ message }: { message: UIMessage }) {
  try {
    // Ensure we have something to generate a title from
    let messageContent = ''

    // Try to extract content from either message.content or message.parts
    if (typeof message.content === 'string' && message.content) {
      messageContent = message.content
    } else if (message.parts && message.parts.length > 0) {
      // Attempt to get text from parts
      for (const part of message.parts) {
        if (part.type === 'text' && 'text' in part && part.text) {
          messageContent = part.text
          break
        }
      }
    }

    // If we still don't have content, return a default title
    if (!messageContent) {
      console.warn('No content found in message for title generation')
      return 'New Chat'
    }

    const { text: title } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: messageContent,
    })

    return title
  } catch (error) {
    console.error('Failed to generate title:', error)
    return 'New Chat' // Fallback title
  }
}

/**
 * Server action to get the GPT.do brain selection from cookies
 */
export async function getGptdoBrainCookieAction(): Promise<SearchOption | null> {
  const cookieStore = await cookies()
  const modelCookie = cookieStore.get(GPTDO_BRAIN_COOKIE)
  return modelCookie?.value ? JSON.parse(modelCookie.value) : null
}

/**
 * Server action to get the GPT.do output selection from cookies
 */
export async function getGptdoOutputCookieAction(): Promise<SearchOption | null> {
  const cookieStore = await cookies()
  const outputCookie = cookieStore.get(GPTDO_OUTPUT_COOKIE)
  return outputCookie?.value ? JSON.parse(outputCookie.value) : null
}

/**
 * Server action to get the GPT.do tool selection from cookies
 */
export async function getGptdoToolCookieAction(): Promise<SearchOption | null> {
  const cookieStore = await cookies()
  const toolCookie = cookieStore.get(GPTDO_TOOLBELT_COOKIE)
  return toolCookie?.value ? JSON.parse(toolCookie.value) : null
}

export async function setGptdoCookieAction({ type, option, pathname }: { type: keyof typeof GPTDO_COOKIE_MAP; option: ConfigOption | null; pathname: string }) {
  const cookieStore = await cookies()

  cookieStore.set(GPTDO_COOKIE_MAP[type], JSON.stringify(option), {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  revalidatePath(pathname)

  return { success: true }
}
