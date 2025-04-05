import Link from 'next/link'
import { cn } from '@/pkgs/ui/src/lib/utils'

export function LlmsdoLogo({ className, domain }: { className?: string; domain?: string }) {
  return (
    <Link href='/sites'>
      <span className={cn('text-lg font-medium', className)}>{domain ?? '.do'}</span>
    </Link>
  )
}
