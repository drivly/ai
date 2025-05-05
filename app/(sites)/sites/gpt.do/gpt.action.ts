'use server'

import { serverAuth } from '@/hooks/server-auth'
import { getCurrentURL } from '@/lib/utils/url'
import { openai } from '@ai-sdk/openai'
import { generateText, UIMessage } from 'ai'
import { cookies, headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { CHAT_MODEL_COOKIE_KEY, COOKIE_MAX_AGE } from './constants'

export async function generateTitleFromUserMessage({ message }: { message: UIMessage }) {
  const { text: title } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  })

  return title
}

/**
 * Server action to get the chat model from cookies
 */
export async function getChatModelCookie() {
  const cookieStore = await cookies()
  const modelCookie = cookieStore.get(CHAT_MODEL_COOKIE_KEY)
  return modelCookie?.value
}

/**
 * Server action to set the chat model in a cookie
 */
export async function setChatModelCookie(modelId: string) {
  const cookieStore = await cookies()
  cookieStore.set(CHAT_MODEL_COOKIE_KEY, modelId, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return { success: true }
}

/**
 * Determines if the current request is on the actual gpt.do domain
 */
export async function isGptDomain() {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  // Check if we're on the actual gpt.do domain or using HOSTNAME_OVERRIDE
  return host === 'gpt.do' || (host === 'localhost:3000' && process.env.HOSTNAME_OVERRIDE === 'gpt.do')
}

/**
 * Returns the appropriate path based on whether we're on the gpt.do domain or not
 * @param basePath The path without the site prefix
 * @returns The path with or without the site prefix based on the domain
 */
export async function getGptPath(basePath: string) {
  const isActualGptDomain = await isGptDomain()

  // If we're on gpt.do, use the direct path, otherwise add the site prefix
  return isActualGptDomain
    ? basePath // Direct path for gpt.do domain
    : `/sites/gpt.do${basePath}` // Path with site prefix for all other domains
}

export const requireAuthentication = async () => {
  const user = await serverAuth()

  if (!user) {
    const headersList = await headers()
    const currentURL = getCurrentURL(headersList)

    // Use the new function to get the callback path
    const callbackPath = await getGptPath('/chat/new')

    const callbackUrl = new URL(callbackPath, currentURL).toString()
    const githubSignInUrl = new URL('/login', currentURL)
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl)

    console.log('Auth redirect', {
      currentURL,
      callbackPath,
      callbackUrl,
      redirect: githubSignInUrl.toString(),
    })

    redirect(githubSignInUrl.toString(), RedirectType.push)
  }
}
