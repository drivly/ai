import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { findSiteContent } from '@/lib/sites'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; product: string; comparison: string }> }): Promise<Metadata> {
  const { domain, product, comparison } = (await params) || {}
  const content = await findSiteContent(domain)

  return {
    title: `${product} Comparison - ${content.title}`,
    description: `Comparing ${product} with ${comparison}`,
  }
}

async function ProductComparisonPage(props: { params: { domain: string; product: string; comparison: string } }) {
  const { domain, product, comparison } = props.params || {}

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24'>
      <h1 className='text-4xl font-bold tracking-tight'>{product} Comparison</h1>
      <p className='mt-4 text-lg text-gray-600'>
        Comparing {product} with {comparison}
      </p>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: ProductComparisonPage })
