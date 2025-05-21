import type { SearchParams } from 'nuqs'
import { requireAuthentication } from './actions/auth.action'
import { getComposioActionsByIntegrationCached } from './actions/composio.action'
import { getGptdoCookieAction } from './actions/gpt.action'
import { Chat } from './components/chat'
import { getAIModels } from './lib/utils'
import { gptdoSearchParamsLoader } from './search-params'

interface ChatHomePageProps {
  searchParams: Promise<SearchParams>
}

export default async function ChatHomePage({ searchParams }: ChatHomePageProps) {
  await requireAuthentication()
  const { tool } = await gptdoSearchParamsLoader(searchParams)
  const initialChatModel = await getGptdoCookieAction({ type: 'model' })

  const integrationName = tool?.includes('.') ? tool?.split('.')[0] : tool

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const models = getAIModels()

  return <Chat id={crypto.randomUUID()} initialChatModel={initialChatModel} initialVisibilityType='private' availableModels={models} toolsPromise={composioPromise} />
}

// Stripe checkout link -> https://buy.stripe.com/test_14AdRbcyF6FU4qW6i28Vi00
