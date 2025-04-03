import Link from 'next/link'
import { cn } from '@drivly/ui/lib'

export function LlmsdoLogo({ className, domain }: { className?: string; domain?: string }) {
  return (
    <Link href='/'>
      <span className={cn('text-lg font-medium', className)}>{domain ?? 'llm.do'}</span>
    </Link>
  )
}
