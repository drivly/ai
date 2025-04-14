'use client'

import { updateOptionParams } from '@/app/_utils/update-option-params'
import { useSitesData } from '@/components/sites/dotdos/useSitesData'
import { sdks } from '@/domains.config'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Fragment } from 'react'
import { DotDoItem } from './dot-do-item'

const domainSuffix = process.env.DOMAIN_SUFFIX || ''

export interface DotDoSectionProps {
  sitesByCategory: Record<string, any[]>
}

export const DotDoSection = (props: DotDoSectionProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { mounted, isBrandDomain, showAbsolute, regionalTld } = useSitesData()

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
              const displayTitle = domain.replace(/\.do(\.gt|\.mw)?$/, '.do')
              
              const currentTld = regionalTld || domainSuffix
              
              return (
                <DotDoItem
                  key={`${domain}-${index}`}
                  title={displayTitle}
                  href={showAbsolute || isBrandDomain 
                    ? `https://${domain}${currentTld}` 
                    : `/sites/${domain}${currentTld}`}
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
