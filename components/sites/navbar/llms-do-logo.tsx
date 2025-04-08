import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LlmsdoLogo({ className, domain }: { className?: string; domain?: string }) {
  return (
    <Link href='/' className={cn('font-ibm z-10 text-lg font-medium', className)}>
      {domain ?? '.do'}
    </Link>
  )
}
