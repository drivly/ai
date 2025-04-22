import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

// export const dynamic = 'force-dynamic'

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
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
      />
      <body>
        <h1>{domain}</h1>
        <div className='project-layout'>{children}</div>
        <Link href='/blog'>Blog</Link>
      </body>
    </html>
  )
}
