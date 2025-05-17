import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SearchParams } from 'nuqs'
import { requireAuthentication } from '../../actions/auth.action'
import { getComposioActionsByIntegrationCached } from '../../actions/composio.action'
import { getGptdoBrainCookieAction } from '../../actions/gpt.action'
import { Chat } from '../../components/chat'
import { DEFAULT_CHAT_MODEL } from '../../lib/constants'
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
  const chatModelFromCookie = await getGptdoBrainCookieAction()

  if (!session) {
    redirect('/login')
  }

  const integrationName = tool?.includes('.') ? tool?.split('.')[0] : tool
  const initialChatModel = !chatModelFromCookie ? DEFAULT_CHAT_MODEL : chatModelFromCookie

  const composioPromise = getComposioActionsByIntegrationCached({ queryKey: ['tools', integrationName] })
  const models = getAIModels()

  return <Chat id={id} initialChatModel={initialChatModel} initialVisibilityType='private' availableModels={models} toolsPromise={composioPromise} />
}
export default ChatPage
