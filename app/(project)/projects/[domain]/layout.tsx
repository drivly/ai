import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export default function ProjectDomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
