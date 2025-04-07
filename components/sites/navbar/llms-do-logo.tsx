import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LlmsdoLogo({ className, domain }: { className?: string; domain?: string }) {
  return (
    <Link href='/sites'>
      <span className={cn('text-lg font-medium', className)}>{domain ?? '.do'}</span>
    </Link>
  )
}
