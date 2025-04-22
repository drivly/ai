import { sitesConfig } from '@/app/_utils/content'
import { DotDoSection } from '@/components/sites/dotdos/dot-do-section'
import { HeroSection } from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Suspense } from 'react'

async function DirectoryPage() {
  const { categories } = sitesConfig

  return (
    <div className='container mx-auto max-w-6xl px-3 pt-5 pb-20 md:pb-40'>
      <HeroSection
        title={
          <>
            Business-as-Code: <br className='block' /> The Future of Intelligent Work
          </>
        }
        description='Do economically valuable work with structured Functions, reliable Workflows, and autonomous AI Agents—transforming intelligence into measurable outcomes.'
        className='pb-16'
      />
      <Suspense
        fallback={
          <div className='container mx-auto flex h-[50vh] items-center justify-center px-3 pt-24'>
            <div className='animate-pulse text-lg opacity-50'>Loading sites...</div>
          </div>
        }>
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
