import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { filterModels, constructModelIdentifier, models, Model, parse } from 'language-models'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata = {
  title: 'Do Services-as-Software',
  description: 'Build AI-native businesses with agentic services through simple APIs and SDKs',
  metadataBase: new URL('https://dotdo.ai'),
  alternates: {
    canonical: 'https://dotdo.ai',
  },
} satisfies Metadata

export const revalidate = 3600

export default async function DirectoryPage() {

  return (
    <div className='container mx-auto max-w-6xl px-3 pt-5 pb-20 md:pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {models.map((model, idx) => (
        <Link key={idx} href={model.permaslug}>
          <h2 className='text-lg line-clamp-1'>{model.name}</h2>
          <p className='text-gray-500 line-clamp-2 text-sm'>{model.description}</p>
        </Link>
      ))}
    </div>
  )
}

