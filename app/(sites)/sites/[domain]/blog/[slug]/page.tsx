import { BlogContent } from '@/components/sites/blog-ui/blog-content'
import { ShareButtons } from '@/components/sites/blog-ui/share-button'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug } from '../blog-posts'
import { slugify } from '@/lib/slugify'
import Balancer from 'react-wrap-balancer'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  const { domain, slug } = await params
  const post = await getBlogPostBySlug(domain, slug)
  return {
    title: post?.title,
    description: post?.description,
  }
}

async function BlogPostPage({ params }: { params: { domain: string; slug: string } }) {
  const { domain, slug } = params
  const headersList = await headers()
  const proto = headersList.get('x-forwarded-proto')
  const host = headersList.get('x-forwarded-host')
  const siteUrl = `${proto}://${host}`
  const post = await getBlogPostBySlug(domain, slug)
  const fallbackImage = '/images/blog-llm.png'

  // If post not found, render custom not found component
  if (!post) {
    return <BlogPostNotFound fallbackImage={fallbackImage} />
  }

  const postUrl = `${siteUrl}/blog/${post.slug || slugify(post.title)}`
  const dateObj = new Date(post?.date || '')
  const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`

  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      <Link href={`/blog`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <Badge className='mb-4 px-3 py-1.5 text-sm hover:bg-gray-100 sm:px-2.5 sm:py-1 sm:text-xs dark:hover:bg-gray-800/50'>{post?.category}</Badge>
        <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text text-4xl leading-tight font-medium tracking-tight text-balance text-transparent dark:from-white dark:to-white/40'>
          <Balancer>{post?.title}</Balancer>
        </h1>
        <p className='text-muted-foreground text-xl'><Balancer>{post?.description}</Balancer></p>
        <div className='mt-4 flex flex-row items-center justify-between gap-2'>
          <div className='text-muted-foreground text-sm'>{formattedDate}</div>
          <ShareButtons title={post?.title || ''} url={postUrl} hideLabel={true} />
        </div>
      </div>

      <div className='relative mb-8 h-[400px] w-full overflow-hidden rounded-lg'>
        <Image src={post?.image || fallbackImage} alt={post?.title || ''} fill className='object-cover' priority />
      </div>

      <BlogContent markdown={post?.markdown || ''} />

      {/* Related domain blog posts */}
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: BlogPostPage })

function BlogPostNotFound({ fallbackImage }: { fallbackImage: string }) {
  return (
    <div className='container mx-auto max-w-4xl px-3 py-24 md:py-32'>
      <Link href={`/blog`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text text-4xl leading-tight font-medium tracking-tighter text-balance text-transparent dark:from-white dark:to-white/40'>
          Blog Post Not Found
        </h1>
        <p className='text-muted-foreground text-xl'>The blog post you're looking for doesn't exist or may have been removed.</p>
      </div>

      <div className='relative mb-8 h-[400px] w-full overflow-hidden rounded-lg'>
        <Image src={fallbackImage} alt='Blog post not found' fill className='object-cover opacity-70' priority />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-background/80 rounded-lg px-8 py-6 text-center backdrop-blur-sm'>
            <h2 className='mb-2 text-2xl font-bold'>404</h2>
            <p className='mb-4'>This blog post could not be found</p>
            <Link
              href={`/blog`}
              className='bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            >
              Browse All Blog Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
