import type { Website } from '@/website.config'
import { websiteKeys } from '@/website.config'
import { notFound } from 'next/navigation'
import '../styles.css'

// need to be able to render the specific website from the slug and throw not found if the slug is not found
export default async function HomePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params

  const site = slug[0] as Website

  if (site && !websiteKeys.includes(site)) {
    return notFound()
  }

  return (
    <div className='home'>
      <h1>{slug[0]}</h1>
    </div>
  )
}
