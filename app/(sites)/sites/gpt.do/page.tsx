import { Suspense } from 'react'
import { requireAuthentication } from './actions/auth.action'
import { getComposioActionsByIntegrationCached } from './actions/composio.action'
import { getGptdoBrainCookieAction } from './actions/gpt.action'
import { Chat } from './components/chat'
import { ChatOptionsSelector } from './components/chat-options-selector'
import { Greeting } from './components/greeting'
import { DEFAULT_CHAT_MODEL } from './lib/constants'
import type { ChatSearchParams } from './lib/types'
import { getAIModels } from './lib/utils'

interface ChatHomePageProps {
  searchParams: Promise<ChatSearchParams>
}

export default async function ChatHomePage({ searchParams }: ChatHomePageProps) {
  await requireAuthentication()
  const { tool } = await searchParams
  const chatModelFromCookie = await getGptdoBrainCookieAction()
  const initialChatModel = !chatModelFromCookie ? DEFAULT_CHAT_MODEL : chatModelFromCookie

  const integrationName = tool?.includes('.') ? tool?.split('.')[0] : tool

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const models = getAIModels()


  return (
    <Chat
      id={crypto.randomUUID()}
      initialChatModel={initialChatModel}
      initialVisibilityType='private'
      availableModels={models}
      toolsPromise={composioPromise}
      session={null}
      greeting={
        <Greeting
          title='Welcome to GPT.do'
          description='Select your model, tool, and output format to get started.'
          config={
            <Suspense>
              <ChatOptionsSelector toolsPromise={composioPromise} availableModels={models} initialChatModel={initialChatModel} />
            </Suspense>
          }
        />
      }
    />
  )
}

// Stripe checkout link -> https://buy.stripe.com/test_14AdRbcyF6FU4qW6i28Vi00
