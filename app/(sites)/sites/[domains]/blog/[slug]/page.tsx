import { notFound } from 'next/navigation'
import { getBlogPost } from '@/lib/blog'
import type { PageProps } from 'next'

export default async function BlogPostPage({ params }: PageProps<{ domains: string; slug: string }>) {
  const { domains, slug } = params
  const domain = `${domains}.do`
  
  const blogPost = await getBlogPost(domain, slug)
  
  if (!blogPost) {
    return notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{blogPost.title}</h1>
      
      {blogPost.description && (
        <div className="text-lg text-gray-600 mb-6">{blogPost.description}</div>
      )}
      
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
    </div>
  )
}
