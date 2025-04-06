import { headers } from 'next/headers'
import { domains } from '@/domains.config'

export type SitemapEntry = {
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export default async function sitemap(): Promise<SitemapEntry[]> {
  const headersList = await headers()
  const host = headersList.get('host') || 'apis.do'
  const baseUrl = `https://${host}`

  const commonPages = ['', '/privacy', '/terms', '/blog', '/pricing']

  const sitemapEntries: SitemapEntry[] = [
    {
      url: `${baseUrl}/sites`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  for (const domain of domains) {
    for (const page of commonPages) {
      sitemapEntries.push({
        url: `${baseUrl}/sites/${domain}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 0.9 : 0.7, // Higher priority for main domain pages
      })
    }
  }

  return sitemapEntries
}
