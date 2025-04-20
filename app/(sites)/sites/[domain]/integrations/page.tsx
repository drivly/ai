import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { getSession } from '@/lib/auth/context/get-context-props'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params
  const content = await findSiteContent(domain)

  return {
    title: `Integrations - ${content.title}`,
    description: `Available integrations for ${content.title}`,
  }
}

async function IntegrationsRootPage(props: { params: { domain: string } }) {
  const { domain } = props.params
  await getSession()

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24'>
      <h1 className='text-4xl font-bold tracking-tight'>Integrations</h1>
      <p className='mt-4 text-lg text-gray-600'>Available integrations placeholder</p>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: IntegrationsRootPage })
