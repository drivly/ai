import { getPayloadAuth } from '@/lib/auth/payload-auth'
import { User } from '@/payload.types'
import { headers as requestHeaders } from 'next/headers'
import WaitlistPage from './waitlist-page'
import { handleWaitlistActions } from '@/lib/auth/actions/waitlist.action'
import { redirect } from 'next/navigation'

export default async function WaitListPage(props: { params: Promise<{ domain: string }> }) {
  const { domain } = await props.params
  const payload = await getPayloadAuth()
  const headers = await requestHeaders()
  const { user } = (await payload.auth({ headers })) as { user: User }

  if (!user) {
    redirect('/')
  }

  const name = user.name || user.email.split('@')[0]

  await handleWaitlistActions(user, domain)

  return <WaitlistPage email={user.email} name={name} subtitle='You are now on the waitlist' />
}
