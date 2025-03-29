import type { Website } from '@/site.config'
import { websiteKeys } from '@/site.config'
import { notFound } from 'next/navigation'
import '@/app/(sites)/sites/styles.css'

// need to be able to render the specific website from the slug and throw not found if the slug is not found
export default async function HomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params

  const site = domain as Website

  if (site && !websiteKeys.includes(site)) {
    return notFound()
  }

  return (
    <div className='home'>
      <h1>{domain}</h1>
    </div>
  )
}
