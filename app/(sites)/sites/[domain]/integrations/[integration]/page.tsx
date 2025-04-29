import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; integration: string }> }): Promise<Metadata> {
  const { domain, integration } = (await params) || {}
  const content = await findSiteContent(domain)

  return {
    title: `${integration} Integration - ${content.title}`,
    description: `${integration} integration options for ${content.title}`,
  }
}

async function IntegrationPage(props: { params: { domain: string; integration: string } }) {
  const { domain, integration } = props.params || {}

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24'>
      <h1 className='text-4xl font-bold tracking-tight'>{integration} Integration</h1>
      <p className='mt-4 text-lg text-gray-600'>{integration} integration options</p>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: IntegrationPage })
