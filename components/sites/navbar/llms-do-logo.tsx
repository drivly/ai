import { cn } from '@/lib/utils'
import Link from 'next/link'
import { siteConfig } from '../../site-config'

export function LlmsdoLogo({ className, domain, minimal }: { className?: string; domain?: string; minimal?: boolean }) {
  const isCareers = domain === 'careers.do' || minimal
  const displayDomain = domain === '%5Bdomain%5D' ? 'workflows.do' : domain

  return (
    <Link href={isCareers ? siteConfig.url : siteConfig.baseLinks.home} className={cn('font-ibm z-10 text-lg font-medium', className)}>
      {displayDomain ?? siteConfig.name}
    </Link>
  )
}
