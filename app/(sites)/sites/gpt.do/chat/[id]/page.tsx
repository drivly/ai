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

  // Fetch either integrations list or actions for a specific integration
  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const loadedModels = getAvailableModels().map((model) => ({ createdAt: model.createdAt, label: model.name, value: model.permaslug }))
  const models = uniqueArrayByObjectPropertyKey(loadedModels, 'label')

  const chatModelFromCookie = await getGptdoBrainCookieAction()

  if (!chatModelFromCookie) {
    return (
      <Chat
        id={id}
        initialChatModel={DEFAULT_CHAT_MODEL}
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
                <ChatOptionsSelector toolsPromise={composioPromise} availableModels={models} initialChatModel={DEFAULT_CHAT_MODEL} />
              </Suspense>
            }
          />
        }
      />
    )
  }

  return (
    <Chat
      id={id}
      initialChatModel={chatModelFromCookie}
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
              <ChatOptionsSelector toolsPromise={composioPromise} availableModels={models} initialChatModel={chatModelFromCookie} />
            </Suspense>
          }
        />
      }
    />
  )
}
export default ChatPage
