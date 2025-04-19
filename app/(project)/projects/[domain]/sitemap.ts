import { headers } from 'next/headers'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { fetchBlogPostsByProject } from '@/lib/fetchBlogPostsByProject'

export default async function sitemap({ params }: { params: Promise<{ domain: string }> }): Promise<
  Array<{
    url: string
    lastModified: Date
    changeFrequency: string
    priority: number
  }>
> {
  const { domain } = await params
  const headersList = await headers()
  const host = headersList.get('host') || domain
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  const project = await fetchProjectByDomain(domain)
  if (!project) {
    return []
  }

  const blogPosts = await fetchBlogPostsByProject(project.id)

  const entries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  for (const post of blogPosts) {
    entries.push({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.updatedAt || post.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })
  }

  return entries
}
