import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = (await params) || {}
  const project = await fetchProjectByDomain(domain)

  if (!project) {
    return {
      title: 'Compare - Not Found',
    }
  }

  return {
    title: `Compare - ${project.name}`,
    description: `Product comparison for ${project.name}`,
  }
}

export default async function CompareRootPage({ params }: { params: Promise<{ domain: string }> }) {
  try {
    const { domain } = (await params) || {}
    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return <div>Project Not Found</div>
    }

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24'>
        <h1 className='text-4xl font-bold tracking-tight'>Compare</h1>
        <p className='mt-4 text-lg text-gray-600'>Product comparison placeholder</p>
      </div>
    )
  } catch (error) {
    console.error('Error in CompareRootPage:', error)
    return <div>Error loading page</div>
  }
}
