import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { User } from '@/payload.types'
import { headers as requestHeaders } from 'next/headers'
import { Waitlist } from './waitlist'
import { handleWaitlistActions } from '@/lib/auth/actions/waitlist.action'
import { redirect } from 'next/navigation'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'

async function WaitListPage(props: { params: Promise<{ domain: string }> }) {
  const { domain } = await props.params
  const payload = await getPayloadWithAuth()
  const headers = await requestHeaders()
  const { user } = (await payload.auth({ headers })) as { user: User }

  if (!user) {
    redirect('/')
  }

  const name = user.name || user.email.split('@')[0]

  await handleWaitlistActions(user, domain)

  return <Waitlist email={user.email} name={name} />
}

export default withSitesWrapper({ WrappedPage: WaitListPage, withFaqs: false, withCallToAction: false })
