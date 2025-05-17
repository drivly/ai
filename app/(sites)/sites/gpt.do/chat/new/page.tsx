import { redirect, RedirectType } from 'next/navigation'
import { getGptPath, requireAuthentication } from '../../actions/auth.action'
import type { ChatSearchParams } from '../../lib/types'
import { createCleanURLParams } from '../../lib/utils'

export default async function NewChatPage({ searchParams }: { searchParams: Promise<ChatSearchParams> }) {
  await requireAuthentication()

  const newChatId = crypto.randomUUID()
  const params = createCleanURLParams(await searchParams)
  const redirectPath = await getGptPath(`/chat/${newChatId}?${params.toString()}`)

  redirect(redirectPath, RedirectType.push)
}
