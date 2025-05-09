import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = (await params) || {}
  const content = await findSiteContent(domain)

  return {
    title: `Compare - ${content.title}`,
    description: `Product comparison for ${content.title}`,
  }
}

async function CompareRootPage(props: { params: { domain: string } }) {
  const { domain } = props.params || {}

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24'>
      <h1 className='text-4xl font-bold tracking-tight'>Compare</h1>
      <p className='mt-4 text-lg text-gray-600'>Product comparison placeholder</p>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: CompareRootPage })
