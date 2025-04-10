import { DotDoSection } from '@/components/sites/dotdos/dot-do-section'
import { getDomainsByCategory } from '@/components/sites/dotdos/get-domain-by-category'
import HeroSection from '@/components/sites/sections/hero-section'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { domains } from '@/domains.config'
import { Suspense } from 'react'

async function DirectoryPage() {
  const domainsByCategory = await getDomainsByCategory(domains)

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
        <DotDoSection domainsByCategory={domainsByCategory} />
      </Suspense>
    </div>
  )
}

export default withSitesWrapper(DirectoryPage)

// experiments.do uses vercel flags api...
// .do
// Process domain categories once
