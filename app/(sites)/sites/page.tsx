import { sitesConfig } from '@/app/_utils/content'
import { DotDoSection } from '@/components/sites/dotdos/dot-do-section'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata = {
  title: 'Do Services-as-Software',
  description: 'Build AI-native businesses with agentic services through simple APIs and SDKs',
  alternates: {
    canonical: 'https://dotdo.ai',
  },
} satisfies Metadata

async function DirectoryPage() {
  const { categories } = sitesConfig

  return (
    <div className='container mx-auto max-w-6xl px-3 pt-5 pb-20 md:pb-40'>
      <HeroSection
        title={
          <>
            Do <br className='block sm:hidden' /> Services-as-Software
          </>
        }
        description='Agentic workflows enabling AI-native businesses to do Business-as-Code and Services-as-Software through simple APIs and SDKs'
        className='pb-16'
      />
      <Suspense
        fallback={
          <div className='container mx-auto flex h-[50vh] items-center justify-center px-3 pt-24'>
            <div className='animate-pulse text-lg opacity-50'>Loading sites...</div>
          </div>
        }
      >
        <DotDoSection categories={categories} />
      </Suspense>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: DirectoryPage })

// experiments.do uses vercel flags api...
// .do
// Process domain categories once

// generateMetadata canonical url dotdo.ai
