import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { serverAuth } from '@/hooks/server-auth'
import { handleWaitlistActions } from '@/lib/auth/actions/waitlist.action'
import { redirect } from 'next/navigation'
import { Waitlist } from './waitlist'

async function WaitlistPage({ params }: { params: { domain: string } }) {
  const { domain } = params
  const user = await serverAuth()
  const validDomain = domain && domain !== '[domain]' ? domain : 'default'

  if (!user) {
    redirect('/login?destination=waitlist')
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))
  await handleWaitlistActions(user, validDomain)

  return <Waitlist email={user.email || ''} name={user.name || user.email?.split('@')[0] || ''} />
}

export default withSitesWrapper({ WrappedPage: WaitlistPage, withCallToAction: false })
