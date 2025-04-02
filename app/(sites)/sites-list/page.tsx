'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/sites/badge'
import { domains, brandDomains, isAIGateway } from '@/domains.config'
import { siteCategories, domainDescriptions } from '@/api.config'

function SitesContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showAbsolute, setShowAbsolute] = useState<boolean>(false)
  const [hostname, setHostname] = useState<string>('')

  useEffect(() => {
    const host = window.location.hostname
    setHostname(host)
    
    const isGateway = isAIGateway(host) || host === 'localhost' || host.includes('vercel.app') || host === 'apis.do'
    const defaultAbsolute = isGateway || searchParams.get('absolute') === 'true'
    setShowAbsolute(defaultAbsolute)
  }, [searchParams])

  const handleToggleChange = (checked: boolean) => {
    setShowAbsolute(checked)
    const params = new URLSearchParams(searchParams)
    params.set('absolute', checked.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const domainsByCategory: Record<string, string[]> = {}
  
  Object.entries(siteCategories).forEach(([category, categoryDomains]) => {
    domainsByCategory[category] = categoryDomains.filter(domain => domains.includes(domain))
  })
  
  const categorizedDomains = Object.values(domainsByCategory).flat()
  const uncategorizedDomains = domains.filter(domain => !categorizedDomains.includes(domain))
  
  if (uncategorizedDomains.length > 0) {
    domainsByCategory['Other'] = uncategorizedDomains
  }

  const isBrandDomain = brandDomains.includes(hostname)

  return (
    <div className="container mx-auto px-4 pt-20 pb-12 md:pt-24 md:pb-32">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Sites</h1>
        <p className="text-muted-foreground text-xl mb-6">Browse all available domains in the .do ecosystem</p>
        
        {!isBrandDomain && (
          <div className="flex items-center space-x-2 mb-8">
            <span className="text-sm mr-2">Show URLs as:</span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleToggleChange(false)}
                className={`px-3 py-1 rounded-md transition-colors ${!showAbsolute ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                Relative
              </button>
              <button
                onClick={() => handleToggleChange(true)}
                className={`px-3 py-1 rounded-md transition-colors ${showAbsolute ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                Absolute
              </button>
            </div>
          </div>
        )}
      </div>
      
      {Object.entries(domainsByCategory).map(([category, categoryDomains]) => (
        <Fragment key={category}>
          <h2 className="text-2xl font-bold mb-4 mt-8">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {categoryDomains.map(domain => {
              const description = domainDescriptions[domain] || '';
              const href = showAbsolute || isBrandDomain 
                ? `https://${domain}`
                : `/sites/${domain}`;
              
              return (
                <Link 
                  href={href} 
                  key={domain}
                  className="bg-card flex flex-col h-full overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">{domain}</h3>
                  <p className="text-muted-foreground text-sm mb-auto">{description}</p>
                  <Badge variant="default" className="mt-3 self-start">
                    {showAbsolute || isBrandDomain ? 'External' : 'Internal'}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export default function SitesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 pt-20 pb-12">Loading sites...</div>}>
      <SitesContent />
    </Suspense>
  )
}
