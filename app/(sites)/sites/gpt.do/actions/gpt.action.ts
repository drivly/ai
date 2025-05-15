'use server'

import { openai } from '@ai-sdk/openai'
import { generateText, UIMessage } from 'ai'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ConfigOption } from '../components/chat-options-selector'
import { SearchOption } from '../lib/types'
import { COOKIE_MAX_AGE, GPTDO_BRAIN_COOKIE, GPTDO_COOKIE_MAP, GPTDO_OUTPUT_COOKIE, GPTDO_TOOLBELT_COOKIE } from '../lib/constants'

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
