import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default function robots(): MetadataRoute.Robots {
  const headersList = headers()
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
