import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getSession } from '@/lib/auth/context/get-context-props'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; integration: string; event: string }> }): Promise<Metadata> {
  const { domain, integration, event } = await params || {}
  const content = await findSiteContent(domain)

  return {
    title: `${integration} Integration - ${content.title}`,
    description: `${integration} integration event: ${event}`,
  }
}

async function IntegrationEventPage(props: { params: { domain: string; integration: string; event: string } }) {
  const { domain, integration, event } = props.params || {}
  await getSession()

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24'>
      <h1 className='text-4xl font-bold tracking-tight'>{integration} Integration</h1>
      <p className='mt-4 text-lg text-gray-600'>Event: {event}</p>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: IntegrationEventPage })
