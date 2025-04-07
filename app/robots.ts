import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { domains, brandDomains } from '../domains.config'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') || 'ai.do'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${protocol}://${host}/sitemap.xml`,
  }
}
