import { AwaitedPageProps, withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Metadata } from 'next'
import { getAvailableModels, getModelProviders } from './utils'
import { ClientModelPage } from './client-model-page'

export const metadata = {
  title: 'Do Services-as-Software',
  description: 'Build AI-native businesses with agentic services through simple APIs and SDKs',
  metadataBase: new URL('https://dotdo.ai'),
  alternates: {
    canonical: 'https://dotdo.ai',
  },
} satisfies Metadata

export const revalidate = 3600

async function ModelsPage({ searchParams }: AwaitedPageProps<{}>) {
  const availableModels = getAvailableModels()
  const uniqueProviders = getModelProviders()

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24 md:py-32 xl:px-0'>
      <div className='mb-12'>
        <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-4 text-4xl leading-none font-medium tracking-tight text-transparent dark:from-white dark:to-white/40'>
          Models
        </h1>
        <p className='font-geist max-w-3xl text-lg text-gray-600 dark:text-gray-400'>Explore and compare AI models available through models.do.</p>
      </div>

      <ClientModelPage initialModels={availableModels} providers={uniqueProviders} searchParams={searchParams ?? {}} />
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: ModelsPage, explicitDomain: 'models.do' })
