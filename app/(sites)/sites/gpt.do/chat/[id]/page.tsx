import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { SearchParams } from 'nuqs'
import { requireAuthentication } from '../../actions/auth.action'
import { getComposioActionsByIntegrationCached } from '../../actions/composio.action'
import { getGptdoCookieAction } from '../../actions/gpt.action'
import { Chat } from '../../components/chat'
import { getAIModels } from '../../lib/utils'
import { gptdoSearchParamsLoader } from '../../search-params'

interface ChatPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<SearchParams>
}

async function ChatPage({ params, searchParams }: ChatPageProps) {
  await requireAuthentication()

  const { id } = await params
  const { tool } = await gptdoSearchParamsLoader(searchParams)

  const session = await auth()
  const initialChatModel = await getGptdoCookieAction({ type: 'model' })

  if (!session) {
    redirect('/login')
  }

  const integrationName = tool?.includes('.') ? tool?.split('.')[0] : tool

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const models = getAIModels()

  return <Chat id={id} initialChatModel={initialChatModel} initialVisibilityType='private' availableModels={models} toolsPromise={composioPromise} />
}
export default ChatPage
