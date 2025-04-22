import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; product: string }> }): Promise<Metadata> {
  const { domain, product } = (await params) || {}
  const content = await findSiteContent(domain)

  return {
    title: `${product} - ${content.title}`,
    description: `${product} comparison options for ${content.title}`,
  }
}

async function ProductPage(props: { params: { domain: string; product: string } }) {
  const { domain, product } = props.params || {}

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24'>
      <h1 className='text-4xl font-bold tracking-tight'>{product}</h1>
      <p className='mt-4 text-lg text-gray-600'>{product} comparison options</p>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: ProductPage })
