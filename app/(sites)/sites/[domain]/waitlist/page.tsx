import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { handleWaitlistActions } from '@/lib/auth/actions/waitlist.action'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { User } from '@/payload.types'
import { headers as requestHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { Waitlist } from './waitlist'

export const dynamic = 'force-dynamic'

async function WaitListPage(props: { params: { domain: string }; searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { domain } = props.params
  const searchParams = await props.searchParams
  const payload = await getPayloadWithAuth()
  const headers = await requestHeaders()
  const { user } = (await payload.auth({ headers })) as { user: User }

  if (!user) {
    const data = await payload.betterAuth.api.signInSocial({
      body: { provider: 'github', callbackURL: '/waitlist' },
    })
    redirect(data.url || '')
  }

  const name = user.name || user.email.split('@')[0]

  await handleWaitlistActions(user, domain)

  return <Waitlist email={user.email} name={name} />
}

export default withSitesWrapper({ WrappedPage: WaitListPage, withFaqs: false, withCallToAction: false })
