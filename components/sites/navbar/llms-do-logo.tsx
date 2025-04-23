import { siteConfig } from '@/components/site-config'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function LlmsdoLogo({ className, domain, minimal }: { className?: string; domain?: string; minimal?: boolean }) {
  const isCareers = domain === 'careers.do' || minimal
  const displayDomain = domain === '%5Bdomain%5D' ? 'Workflows.do' : domain?.replace(/\.do(\.mw|\.gt)?$/, '.do')

  return (
    <Link href={isCareers ? siteConfig.url : siteConfig.baseLinks.home} className={cn('font-ibm z-10 text-lg font-medium sm:text-base', className)}>
      {displayDomain ? displayDomain.slice(0, 1).toUpperCase() + displayDomain.slice(1) : siteConfig.name}
    </Link>
  )
}
