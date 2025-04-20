import React from 'react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const generateMetadata = async ({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> => {
  const { domain } = await params
  return {
    title: domain
  }
}

export default async function ProjectLayout({ children, params }: { children: React.ReactNode, params: Promise<{ domain: string }> }) {
  const { domain } = await params
  return (
    <html>
      <body>
        <h1>{domain}</h1>
        <div className='project-layout'>{children}</div>
      </body>
    </html>
  )
}
