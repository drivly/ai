import { uniqueArrayByObjectPropertyKey } from '@/lib/utils'
import { Suspense } from 'react'
import { getAvailableModels } from '../models.do/utils'
import { requireAuthentication } from './actions/auth.action'
import { getComposioActionsByIntegrationCached } from './actions/composio.action'
import { Chat } from './components/chat'
import { ChatOptionsSelector } from './components/chat-options-selector'
import { Greeting } from './components/greeting'
import { DEFAULT_CHAT_MODEL } from './lib/constants'

export default async function ChatHomePage() {
  await requireAuthentication()

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', undefined] })
  const loadedModels = getAvailableModels().map((model) => ({ createdAt: model.createdAt, label: model.name, value: model.permaslug }))
  const models = uniqueArrayByObjectPropertyKey(loadedModels, 'label')

  return (
    <Chat
      id={crypto.randomUUID()}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType='private'
      availableModels={models}
      toolsPromise={composioPromise}
      session={null}
      greeting={
        <Greeting
          title='Welcome to GPT.do'
          description='Select your model, tool, and output format to get started.'
          config={
            <Suspense fallback={<div>Loading...</div>}>
              <ChatOptionsSelector toolsPromise={composioPromise} availableModels={models} initialChatModel={DEFAULT_CHAT_MODEL} />
            </Suspense>
          }
        />
      }
    />
  )
}
