'use client'

import { sdks } from '@/domains.config'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Fragment } from 'react'
import { DotDoItem } from './dot-do-item'
import { updateOptionParams } from './update-option-params'
import { useSitesData } from './useSitesData'

export interface DotDoSectionProps {
  sitesByCategory: Record<string, any[]>
}

export const DotDoSection = (props: DotDoSectionProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { mounted, isBrandDomain, showAbsolute, currentTld } = useSitesData()

  return (
    <Fragment>
      <div className='mb-16'>
        {!isBrandDomain && (
          <div className='mb-8 flex items-center space-x-2'>
            <span className='mr-2 text-sm font-medium opacity-70'>Show URLs as:</span>
            <div className='flex items-center space-x-4'>
              <Link
                href={{
                  pathname,
                  query: updateOptionParams('absolute', 'false', searchParams),
                }}
                className={`rounded-full px-4 py-1 text-sm transition-all ${!showAbsolute ? 'bg-white/10 font-medium shadow-sm backdrop-blur-sm' : 'text-gray-400 hover:text-gray-100'}`}>
                Relative
              </Link>
              <Link
                href={{
                  pathname,
                  query: updateOptionParams('absolute', 'true', searchParams),
                }}
                className={`rounded-full px-4 py-1 text-sm transition-all ${showAbsolute ? 'bg-white/10 font-medium shadow-sm backdrop-blur-sm' : 'text-gray-400 hover:text-gray-100'}`}>
                Absolute
              </Link>
            </div>
          </div>
        )}
      </div>

      {Object.entries(props.sitesByCategory).map(([category, sites]) => (
        <Fragment key={category}>
          <h2 className='mt-16 mb-6 text-2xl font-bold'>{category}</h2>
          <div className='mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
            {sites.map((site, index) => {
              const domain = site.title.split(' - ')[0]
              const displayDomain = domain.replace(/\.do(\.gt|\.mw)?$/, '.do')
              const domainSuffix = process.env.DOMAIN_SUFFIX || ''

              return (
                <DotDoItem
                  key={`${domain}-${index}`}
                  title={displayDomain}
                  href={showAbsolute || isBrandDomain ? `https://${domain}${currentTld || domainSuffix}` : `/sites/${domain}${currentTld || domainSuffix}`}
                  description={site.description}
                  hasSdk={sdks.includes(domain)}
                  mounted={mounted}
                />
              )
            })}
          </div>
        </Fragment>
      ))}
    </Fragment>
  )
}
