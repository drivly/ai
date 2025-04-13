import { headers } from 'next/headers'
import { domains, brandDomains } from '../config/domains.config'

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
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  const commonPages = ['', '/docs', '/blog', '/privacy', '/terms', '/pricing']
  
  const sitemapEntries: SitemapEntry[] = []

  if (brandDomains.includes(host)) {
    for (const page of commonPages) {
      sitemapEntries.push({
        url: `${protocol}://${host}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      })
    }
    return sitemapEntries
  }

  if (host.endsWith('.do') || host.endsWith('.do.gt') || host.endsWith('.do.mw')) {
    for (const page of commonPages) {
      sitemapEntries.push({
        url: `${protocol}://${host}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      })
    }
    return sitemapEntries
  }

  sitemapEntries.push({
    url: `${protocol}://${host}/sites`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  for (const domain of domains) {
    for (const page of commonPages) {
      sitemapEntries.push({
        url: `${protocol}://${host}/sites/${domain}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 0.9 : 0.7, // Higher priority for main domain pages
      })
    }
  }

  for (const domain of brandDomains) {
    for (const page of commonPages) {
      sitemapEntries.push({
        url: `${protocol}://${host}/sites/${domain}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 0.9 : 0.7, // Higher priority for main domain pages
      })
    }
  }

  return sitemapEntries
}
