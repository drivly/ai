import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { BlogContent } from '@/components/sites/blog-ui/dynamic-blog-content'
import { ShareButtons } from '@/components/sites/blog-ui/share-button'
import { cache } from 'react'
import { writeBlogPost } from '@/.ai/functions/content'
import Markdown from 'react-markdown'

const getData = cache(async ({ domain, slug }: { domain: string; slug: string }) => {
  const post = await writeBlogPost({ domain, slug })
  return post
})

export async function generateMetadata({ params }: { params: Promise<{ domain: string; slug: string }> }): Promise<Metadata> {
  const { domain, slug } = await params || {}
  const post = await getData({ domain, slug })

  return {
    title: post.title,
    description: post.description,
  }
}


export default async function BlogPostPage({ params }: { params: Promise<{ domain: string; slug: string }> }) {

  const { domain, slug } = await params || {}
  const post = await getData({ domain, slug })

  return (
    <div >
      <Link href='/blog'>
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
        </div>

        <Markdown>{post.markdown}</Markdown>

      </article>
    </div>
  )
}
