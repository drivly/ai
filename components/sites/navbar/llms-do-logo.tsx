import Link from 'next/link'
import { cn } from '@/lib/utils'
import { siteConfig } from '../../site-config'

export function LlmsdoLogo({ className, domain }: { className?: string; domain?: string }) {
  return (
    <Link href={siteConfig.baseLinks.home} className={cn('font-ibm z-10 text-lg font-medium', className)}>
      {domain ?? siteConfig.name}
    </Link>
  )
}
