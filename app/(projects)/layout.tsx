import React from 'react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const generateMetadata = async ({ params }: { params: { domain: string } }): Promise<Metadata> => {
  const { domain } = await params
  return {
    title: domain
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className='project-layout'>{children}</div>
      </body>
    </html>
  )
}
