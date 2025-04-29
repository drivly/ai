import '@picocss/pico/css/pico.min.css'
import type { Metadata } from 'next'
import React from 'react'

export const generateMetadata = async ({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> => {
  const { domain } = await params
  return {
    title: domain,
  }
}

export default async function ProjectLayout({ children, params }: { children: React.ReactNode; params: Promise<{ domain: string }> }) {
  const { domain } = await params
  return (
    <html>
      <body className='container'>
        <h1>{domain}</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
