import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; product: string }> }): Promise<Metadata> {
  const { domain, product } = (await params) || {}
  const project = await fetchProjectByDomain(domain)

  if (!project) {
    return {
      title: 'Product - Not Found',
    }
  }

  return {
    title: `${product} - ${project.name}`,
    description: `${product} comparison options for ${project.name}`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ domain: string; product: string }> }) {
  try {
    const { domain, product } = (await params) || {}
    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return <div>Project Not Found</div>
    }

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24'>
        <h1 className='text-4xl font-bold tracking-tight'>{product}</h1>
        <p className='mt-4 text-lg text-gray-600'>{product} comparison options</p>
      </div>
    )
  } catch (error) {
    console.error('Error in ProductPage:', error)
    return <div>Error loading page</div>
  }
}
