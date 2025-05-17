import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { requireAuthentication } from '../../actions/auth.action'
import { getComposioActionsByIntegrationCached } from '../../actions/composio.action'
import { getGptdoBrainCookieAction } from '../../actions/gpt.action'
import { Chat } from '../../components/chat'
import { ChatOptionsSelector } from '../../components/chat-options-selector'
import { Greeting } from '../../components/greeting'
import { DEFAULT_CHAT_MODEL } from '../../lib/constants'
import { ChatSearchParams } from '../../lib/types'
import { getAIModels } from '../../lib/utils'

interface ChatPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<ChatSearchParams>
}

async function ChatPage({ params, searchParams }: ChatPageProps) {
  await requireAuthentication()

  const { id } = await params
  const { tool } = await searchParams

  const session = await auth()
  const chatModelFromCookie = await getGptdoBrainCookieAction()
  
  if (!session) {
    redirect('/login')
  }
  
  const integrationName = tool?.includes('.') ? tool?.split('.')[0] : tool
  const initialChatModel = !chatModelFromCookie ? DEFAULT_CHAT_MODEL : chatModelFromCookie

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const models = getAIModels()

  return (
    <Chat
      id={id}
      initialChatModel={initialChatModel}
      initialVisibilityType='private'
      availableModels={models}
      toolsPromise={composioPromise}
      session={session}
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
export default ChatPage
