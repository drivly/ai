'use client'

import { domainDescriptions } from '@/api.config'
import { updateOptionParams } from '@/app/_utils/update-option-params'
import { useSitesData } from '@/components/sites/dotdos/useSitesData'
import { getGlowColor } from '@/domains.config'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Fragment } from 'react'
import { DotDoItem } from './dot-do-item'

export interface DotDoSectionProps {
  domainsByCategory: Record<string, string[]>
}

export const DotDoSection = (props: DotDoSectionProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { mounted, isBrandDomain, showAbsolute } = useSitesData()

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

      {Object.entries(props.domainsByCategory).map(([category, categoryDomains]) => (
        <Fragment key={category}>
          <h2 className='mt-16 mb-6 text-2xl font-bold'>{category}</h2>
          <div className='mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {categoryDomains.map((domain) => (
              <DotDoItem
                key={domain}
                title={domain}
                href={showAbsolute || isBrandDomain ? `https://${domain}` : `/sites/${domain}`}
                description={domainDescriptions[domain]}
                type={showAbsolute || isBrandDomain ? 'External' : 'Internal'}
                mounted={mounted}
                glowColor={mounted ? getGlowColor(domain) : '#05b2a6'}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </Fragment>
  )
}
