import { Suspense } from 'react'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import type { PageProps } from 'next'

export default async function BlogPage({ params }: PageProps<{ domains: string }>) {
  const { domains } = params
  const domain = `${domains}.do`
  
  const blogPosts = await getBlogPosts(domain)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <Suspense fallback={<div>Loading blog posts...</div>}>
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <div key={index} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
              <Link href={`/sites/${domains}/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{post.title}</h2>
                {post.description && (
                  <p className="mt-2 text-gray-600">{post.description}</p>
                )}
              </Link>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  )
}
