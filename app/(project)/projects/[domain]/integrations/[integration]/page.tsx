import type { Metadata } from 'next'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; integration: string }> }): Promise<Metadata> {
  const { domain, integration } = await params
  const project = await fetchProjectByDomain(domain)

  if (!project) {
    return {
      title: 'Integration - Not Found',
    }
  }

  return {
    title: `${integration} Integration - ${project.name}`,
    description: `${integration} integration options for ${project.name}`,
  }
}

export default async function IntegrationPage({ params }: { params: Promise<{ domain: string; integration: string }> }) {
  try {
    const { domain, integration } = await params
    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return <div>Project Not Found</div>
    }

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24'>
        <h1 className='text-4xl font-bold tracking-tight'>{integration} Integration</h1>
        <p className='mt-4 text-lg text-gray-600'>{integration} integration options</p>
      </div>
    )
  } catch (error) {
    console.error('Error in IntegrationPage:', error)
    return <div>Error loading page</div>
  }
}
