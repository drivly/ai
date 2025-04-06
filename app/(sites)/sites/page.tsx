import { DotDoSection } from '@/components/sites/dotdos/dot-do-section'
import { getDomainsByCategory } from '@/components/sites/dotdos/get-domain-by-category'
import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { domains } from '@/domains.config'
import { Suspense } from 'react'
// api - /api, sdk - /sdk pagckage domains config link to that apis.do sdk, docs - /docs Get Started or Join Waitlist

// experiments.do uses vercel flags api...
// .do
// Process domain categories once

function SitesPage() {
  const domainsByCategory = getDomainsByCategory(domains)
  return (
    <div className='container mx-auto max-w-7xl px-4 pt-24 pb-20 md:pt-32 md:pb-40'>
      <div className='mb-16'>
        <h1 className='mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-500'>Sites</h1>
        <p className='text-muted-foreground mb-10 max-w-2xl text-xl'>Browse all available domains in the .do ecosystem</p>
        <Suspense
          fallback={
            <div className='container mx-auto flex h-[50vh] items-center justify-center px-4 pt-24'>
              <div className='animate-pulse text-lg opacity-50'>Loading sites...</div>
            </div>
          }
        >
          <DotDoSection domainsByCategory={domainsByCategory} />
        </Suspense>
      </div>
    </div>
  )
}

export default withSitesNavbar(SitesPage)
