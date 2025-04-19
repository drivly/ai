import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { fetchBlogPostsByProject } from '@/lib/fetchBlogPostsByProject'
import { BlogPosts } from '@/components/sites/blog-ui/blog-posts'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params
  const project = await fetchProjectByDomain(domain)

  if (!project) {
    return {
      title: 'Blog - Project Not Found',
    }
  }

  return {
    title: `Blog - ${project.name}`,
    description: `Latest articles from ${project.name}`,
  }
}

export default async function BlogPage({ params }: { params: Promise<{ domain: string }> }) {
  try {
    const { domain } = await params
    const project = await fetchProjectByDomain(domain)

    if (!project) {
      return <div>Project Not Found</div>
    }

    const blogPosts = await fetchBlogPostsByProject(project.id)

    const posts = blogPosts.map((post) => {
      const postData = post.data as
        | {
            excerpt?: string
            coverImage?: string
            content?: string
          }
        | undefined

      return {
        slug: post.id,
        title: post.name || 'Untitled',
        description: postData?.excerpt || '',
        date: new Date(post.createdAt).toLocaleDateString(),
        category: (typeof post.type?.value === 'object' ? post.type.value.name : post.type?.relationTo) || 'Uncategorized',
        image: postData?.coverImage || '/images/blog-default.png',
      }
    })

    const categories = Array.from(new Set(posts.map((post) => post.category)))

    return (
      <div className='container mx-auto max-w-6xl px-3 py-24 md:py-32'>
        <div className='mb-8'>
          <Link href='/' className='hover:text-primary mb-4 inline-flex items-center text-sm text-gray-500 transition-colors'>
            <ArrowLeft className='mr-1 h-4 w-4' />
            Back
          </Link>
          <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text text-4xl leading-tight font-medium tracking-tighter text-balance text-transparent dark:from-white dark:to-white/40'>
            Blog
          </h1>
        </div>

        <BlogPosts initialPosts={posts} categories={categories} />
      </div>
    )
  } catch (error) {
    console.error('Error in BlogPage:', error)
    return <div>Error loading blog posts</div>
  }
}
