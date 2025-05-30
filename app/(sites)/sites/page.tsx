import { sitesConfig } from '@/.velite'
import { DotDoSection } from '@/components/sites/dotdos/dot-do-section'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata = {
  title: 'Do Services-as-Software',
  description: 'Build AI-native businesses with agentic services through simple APIs and SDKs',
  metadataBase: new URL('https://dotdo.ai'),
  alternates: {
    canonical: 'https://dotdo.ai',
  },
} satisfies Metadata

async function DirectoryPage() {
  const { categories } = sitesConfig

  return (
    // 'container mx-auto max-w-6xl px-3 py-24 md:py-32 xl:px-0
    <div className='container mx-auto max-w-6xl px-3 pt-5 pb-20 md:pb-40 xl:px-0'>
      <HeroSection
        title={
          <>
            Do Business-as-Code: <br className='block' /> The Future of Intelligent Work
          </>
        }
        description='Do economically valuable Services-as-Software with agentic Workflows and autonomous AI Agents — transforming intelligence into measurable outcomes.'
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
