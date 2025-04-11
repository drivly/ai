import { DotDoSection } from '@/components/sites/dotdos/dot-do-section'
import { getSitesByCategory } from '@/components/sites/dotdos/get-sites-by-category'
import HeroSection from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { sites } from '@/app/_utils/content'
import { Suspense } from 'react'

async function DirectoryPage() {
  const sitesByCategory = await getSitesByCategory(sites)

  return (
    <div className='container mx-auto max-w-6xl px-3 pt-5 pb-20 md:pb-40'>
      <HeroSection
        title={
          <>
            Do <br className='block sm:hidden' /> Business-as-Code
          </>
        }
        description='Purpose-built domains for your business workflows and AI integrations'
        className='pb-16'
      />
      <Suspense
        fallback={
          <div className='container mx-auto flex h-[50vh] items-center justify-center px-3 pt-24'>
            <div className='animate-pulse text-lg opacity-50'>Loading sites...</div>
          </div>
        }>
        <DotDoSection sitesByCategory={sitesByCategory} />
      </Suspense>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: DirectoryPage })

// experiments.do uses vercel flags api...
// .do
// Process domain categories once
