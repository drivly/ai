'use client'

import { domainDescriptions, siteCategories } from '@/api.config'
import { Badge } from '@/components/sites/badge'
import { brandDomains, domains } from '@/domains.config'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Fragment, Suspense, useEffect, useState } from 'react'

function SitesContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hostname, setHostname] = useState<string>('')

  const absoluteURL = searchParams.get('absolute') || 'true'

  useEffect(() => {
    const host = window.location.hostname
    setHostname(host)
  }, [])

  const domainsByCategory: Record<string, string[]> = {}

  Object.entries(siteCategories).forEach(([category, categoryDomains]) => {
    domainsByCategory[category] = categoryDomains.filter((domain) => domains.includes(domain))
  })

  const categorizedDomains = Object.values(domainsByCategory).flat()
  const uncategorizedDomains = domains.filter((domain) => !categorizedDomains.includes(domain))

  if (uncategorizedDomains.length > 0) {
    domainsByCategory['Other'] = uncategorizedDomains
  }

  const isBrandDomain = brandDomains.includes(hostname)
  const showAbsolute = absoluteURL === 'true'

  return (
    <div className='container mx-auto px-4 pt-20 pb-12 md:pt-24 md:pb-32'>
      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Sites</h1>
        <p className='text-muted-foreground mb-6 text-xl'>Browse all available domains in the .do ecosystem</p>

        {!isBrandDomain && (
          <div className='mb-8 flex items-center space-x-2'>
            <span className='mr-2 text-sm'>Show URLs as:</span>
            <div className='flex items-center space-x-4'>
              <Link
                href={{
                  pathname,
                  query: updateOptionParams('absolute', 'false', searchParams),
                }}
                className={`rounded-md px-3 py-1 transition-colors ${!showAbsolute ? 'bg-gray-200 font-bold dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                Relative
              </Link>
              <Link
                href={{
                  pathname,
                  query: updateOptionParams('absolute', 'true', searchParams),
                }}
                className={`rounded-md px-3 py-1 transition-colors ${showAbsolute ? 'bg-gray-200 font-bold dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                Absolute
              </Link>
            </div>
          </div>
        )}
      </div>

      {Object.entries(domainsByCategory).map(([category, categoryDomains]) => (
        <Fragment key={category}>
          <h2 className='mt-8 mb-4 text-2xl font-bold'>{category}</h2>
          <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {categoryDomains.map((domain) => {
              const description = domainDescriptions[domain] || ''
              const href = showAbsolute || isBrandDomain ? `https://${domain}` : `/sites/${domain}`

              return (
                <Link
                  href={href}
                  key={domain}
                  className='bg-card flex h-full flex-col overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-md'>
                  <h3 className='group-hover:text-primary mb-2 text-xl font-semibold'>{domain}</h3>
                  <p className='text-muted-foreground mb-auto text-sm'>{description}</p>
                  <Badge variant='default' className='mt-3 self-start'>
                    {showAbsolute || isBrandDomain ? 'External' : 'Internal'}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export default function SitesPage() {
  return (
    <Suspense fallback={<div className='container mx-auto px-4 pt-20 pb-12'>Loading sites...</div>}>
      <SitesContent />
    </Suspense>
  )
}

function updateOptionParams(key: string, value: string, search: URLSearchParams) {
  const queryParams = { ...Object.fromEntries(search) }

  if (queryParams[key] === value) {
    if (key === 'make' && queryParams['model']) {
      delete queryParams['model']
    }
    delete queryParams[key]
  } else {
    queryParams[key] = value
  }

  return queryParams
}
