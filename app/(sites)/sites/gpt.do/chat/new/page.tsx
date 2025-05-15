import { redirect, RedirectType } from 'next/navigation'
import { requireAuthentication, getGptPath } from '../../actions/auth.action'
import { createCleanURLParams } from '../../lib/utils'
import { ChatSearchParams } from '../../lib/types'

export default async function NewChatPage({ searchParams }: { searchParams: Promise<ChatSearchParams> }) {
  await requireAuthentication()

  const newChatId = crypto.randomUUID()
  const params = createCleanURLParams(await searchParams)
  const redirectPath = await getGptPath(`/chat/${newChatId}?${params.toString()}`)

  redirect(redirectPath, RedirectType.push)
}
