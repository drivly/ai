import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; integration: string; event: string }> }): Promise<Metadata> {
  const { domain, integration, event } = await params || {}
  const project = await fetchProjectByDomain(domain)

  if (!project) {
    return {
      title: 'Integration Event - Not Found',
    }
  }

  return {
    title: `${integration} Integration - ${project.name}`,
    description: `${integration} integration event: ${event}`,
  }
}

export default async function IntegrationEventPage({ params }: { params: Promise<{ domain: string; integration: string; event: string }> }) {
  try {
    const { domain, integration, event } = await params || {}
    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return <div>Project Not Found</div>
    }

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24'>
        <h1 className='text-4xl font-bold tracking-tight'>{integration} Integration</h1>
        <p className='mt-4 text-lg text-gray-600'>Event: {event}</p>
      </div>
    )
  } catch (error) {
    console.error('Error in IntegrationEventPage:', error)
    return <div>Error loading page</div>
  }
}
