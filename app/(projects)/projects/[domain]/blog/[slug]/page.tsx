import { getBlogPostBySlug } from '@/app/(sites)/sites/[domain]/blog/blog-posts'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import Markdown from 'react-markdown'

const getData = cache(async ({ domain, slug }: { domain: string; slug: string }) => {
  // const post = await writeBlogPost({ domain, slug })
  const post = await getBlogPostBySlug(domain, slug)
  return post
})

export async function generateMetadata({ params }: { params: Promise<{ domain: string; slug: string }> }): Promise<Metadata> {
  const { domain, slug } = (await params) || {}
  const post = await getData({ domain, slug })

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  const { domain, slug } = (await params) || {}
  const post = await getData({ domain, slug })

  return (
    <div>
      <Link href='/blog' prefetch={true}>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back to blog
      </Link>

      <article>
        <div className='mb-8'>
          <Badge variant='outline' className='mb-4'>
            {post.category}
          </Badge>
          <h1 className='text-4xl font-bold tracking-tight'>{post.title}</h1>
          <p className='text-muted-foreground mt-2 text-lg'>{post.description}</p>
          <div className='text-muted-foreground mt-2 text-sm'>{post.readingTime || '3 min read'}</div>
        </div>

        <Markdown>{post.markdown}</Markdown>
      </article>
    </div>
  )
}
