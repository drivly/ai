import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { filterModels, constructModelIdentifier, Model, parse } from 'language-models'
import { Metadata } from 'next'

export const metadata = {
  title: 'Do Services-as-Software',
  description: 'Build AI-native businesses with agentic services through simple APIs and SDKs',
  metadataBase: new URL('https://dotdo.ai'),
  alternates: {
    canonical: 'https://dotdo.ai',
  },
} satisfies Metadata

export const revalidate = 3600

export default async function DirectoryPage({ params }: { params: Promise<{ lab: string }> }) {

  const models = filterModels((await params).lab)

  return (
    <div className='container mx-auto max-w-6xl px-3 pt-5 pb-20 md:pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {models.models.map((model) => (
        <div key={model.permaslug}>
          <h2 className='text-2xl font-bold'>{model.name}</h2>
          <p className='text-gray-500'>{model.description}</p>
        </div>
      ))}
    </div>
  )
}

