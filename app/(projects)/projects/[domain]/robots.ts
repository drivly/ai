import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots({ params }: { params: Promise<{ domain: string }> }): Promise<MetadataRoute.Robots> {
  const { domain } = await params
  const headersList = await headers()
  const host = headersList.get('host') || domain
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${protocol}://${host}/sitemap.xml`,
  }
}
