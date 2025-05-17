import { SearchParams } from 'nuqs'
import { requireAuthentication } from './actions/auth.action'
import { getComposioActionsByIntegrationCached } from './actions/composio.action'
import { getGptdoBrainCookieAction } from './actions/gpt.action'
import { Chat } from './components/chat'
import { DEFAULT_CHAT_MODEL } from './lib/constants'
import { getAIModels } from './lib/utils'
import { gptdoSearchParamsLoader } from './search-params'

interface ChatHomePageProps {
  searchParams: Promise<SearchParams>
}

export default async function ChatHomePage({ searchParams }: ChatHomePageProps) {
  await requireAuthentication()
  const { tool } = await gptdoSearchParamsLoader(searchParams)
  const chatModelFromCookie = await getGptdoBrainCookieAction()
  const initialChatModel = !chatModelFromCookie ? DEFAULT_CHAT_MODEL : chatModelFromCookie

  const integrationName = tool?.includes('.') ? tool?.split('.')[0] : tool

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const models = getAIModels()

  return <Chat id={crypto.randomUUID()} initialChatModel={initialChatModel} initialVisibilityType='private' availableModels={models} toolsPromise={composioPromise} />
}

// Stripe checkout link -> https://buy.stripe.com/test_14AdRbcyF6FU4qW6i28Vi00
