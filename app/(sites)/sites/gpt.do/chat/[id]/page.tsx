import { auth } from '@/auth'
import { uniqueArrayByObjectPropertyKey } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getAvailableModels } from '../../../models.do/utils'
import { requireAuthentication } from '../../actions/auth.action'
import { getComposioActionsByIntegrationCached } from '../../actions/composio.action'
import { getGptdoBrainCookieAction } from '../../actions/gpt.action'
import { Chat } from '../../components/chat'
import { ChatOptionsSelector } from '../../components/chat-options-selector'
import { Greeting } from '../../components/greeting'
import { DEFAULT_CHAT_MODEL } from '../../lib/constants'
import { ChatSearchParams } from '../../lib/types'

interface ChatPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<ChatSearchParams>
}

async function ChatPage({ params, searchParams }: ChatPageProps) {
  await requireAuthentication()

  const { id } = await params
  const { tool } = await searchParams

  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const isAction = tool?.includes('.')
  const integrationName = isAction ? tool?.split('.')[0] : tool

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const loadedModels = getAvailableModels().map((model) => ({ createdAt: model.createdAt, label: model.name, value: model.permaslug }))
  const models = uniqueArrayByObjectPropertyKey(loadedModels, 'label')

  const chatModelFromCookie = await getGptdoBrainCookieAction()

  const initialChatModel = !chatModelFromCookie ? DEFAULT_CHAT_MODEL : chatModelFromCookie

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
