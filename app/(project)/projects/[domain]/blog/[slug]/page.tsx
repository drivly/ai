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

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; slug: string }> }): Promise<Metadata> {
  const { domain, slug } = await params

  const project = await fetchProjectByDomain(domain)
  if (!project) return { title: 'Post Not Found' }

  const payload = await getPayload({ config })
  const post = await payload
    .findByID({
      collection: 'resources',
      id: slug,
    })
    .catch(() => null)

  if (!post) return { title: 'Post Not Found' }

  const postData = post.data as
    | {
        excerpt?: string
        coverImage?: string
        content?: string
      }
    | undefined

  return {
    title: `${post.name || 'Untitled'} - ${project.name}`,
    description: postData?.excerpt || '',
    openGraph: {
      images: postData?.coverImage ? [postData.coverImage] : undefined,
    },
  }
}

function BlogPostNotFound({ fallbackImage = '/images/blog-default.png' }) {
  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      <Link href='/blog' className='hover:text-primary mb-4 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back to blog
      </Link>
      <div className='mt-16 text-center'>
        <h1 className='text-4xl font-bold'>Post Not Found</h1>
        <p className='mt-4 text-lg text-gray-600'>The blog post you're looking for doesn't exist or has been removed.</p>
        <Image src={fallbackImage} alt='Post not found' width={600} height={400} className='mx-auto mt-8 rounded-lg' />
        <div className='mt-8'>
          <Link href='/blog' className='text-primary hover:text-primary/80 font-medium'>
            Browse all posts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function BlogPostPage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  try {
    const { domain, slug } = await params
    const headersList = await headers()
    const proto = headersList.get('x-forwarded-proto') || 'https'
    const host = headersList.get('x-forwarded-host') || domain
    const siteUrl = `${proto}://${host}`

    const project = await fetchProjectByDomain(domain)
    if (!project) return <BlogPostNotFound />

    const payload = await getPayload({ config })
    const post = await payload
      .findByID({
        collection: 'resources',
        id: slug,
      })
      .catch(() => null)

    if (!post) return <BlogPostNotFound />

    if (post.tenant !== project.id) return <BlogPostNotFound />

    const postData = post.data as { excerpt?: string; coverImage?: string; content?: string } | undefined

    const blogPost = {
      slug: post.id,
      title: post.name || 'Untitled',
      description: postData?.excerpt || '',
      date: new Date(post.createdAt).toLocaleDateString(),
      category: (typeof post.type?.value === 'object' ? post.type.value.name : post.type?.relationTo) || 'Uncategorized',
      image: postData?.coverImage || '/images/blog-default.png',
      content: postData?.content || '',
    }

    return (
      <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
        <Link href='/blog' className='hover:text-primary mb-4 inline-flex items-center text-sm text-gray-500 transition-colors'>
          <ArrowLeft className='mr-1 h-4 w-4' />
          Back to blog
        </Link>

        <article>
          <div className='mb-8'>
            <Badge variant='outline' className='mb-4'>
              {blogPost.category}
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight'>{blogPost.title}</h1>
            <p className='text-muted-foreground mt-2 text-lg'>{blogPost.description}</p>
            <div className='mt-4 flex items-center'>
              <time className='text-muted-foreground text-sm'>{blogPost.date}</time>
            </div>
          </div>

          {blogPost.image && (
            <div className='mb-8 overflow-hidden rounded-lg'>
              <Image src={blogPost.image} alt={blogPost.title} width={900} height={500} className='w-full object-cover' />
            </div>
          )}

          <BlogContent content={blogPost.content} />

          <div className='mt-8 flex items-center justify-between border-t border-gray-200 pt-8'>
            <ShareButtons url={`${siteUrl}/blog/${blogPost.slug}`} title={blogPost.title} />
          </div>
        </article>
      </div>
    )
  } catch (error) {
    console.error('Error in BlogPostPage:', error)
    return <BlogPostNotFound />
  }
}
