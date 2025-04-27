import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; product: string; comparison: string }> }): Promise<Metadata> {
  const { domain, product, comparison } = (await params) || {}
  const project = await fetchProjectByDomain(domain)

  if (!project) {
    return {
      title: 'Product Comparison - Not Found',
    }
  }

  return {
    title: `${product} Comparison - ${project.name}`,
    description: `Comparing ${product} with ${comparison}`,
  }
}

export default async function ProductComparisonPage({ params }: { params: Promise<{ domain: string; product: string; comparison: string }> }) {
  try {
    const { domain, product, comparison } = (await params) || {}
    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return <div>Project Not Found</div>
    }

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24'>
        <h1 className='text-4xl font-bold tracking-tight'>{product} Comparison</h1>
        <p className='mt-4 text-lg text-gray-600'>
          Comparing {product} with {comparison}
        </p>
      </div>
    )
  } catch (error) {
    console.error('Error in ProductComparisonPage:', error)
    return <div>Error loading page</div>
  }
}
