import { Badge } from '@/components/sites/badge'
import { BlogContent } from '@/components/sites/blog-ui/blog-content'
import { ShareButtons } from '@/components/sites/blog-ui/share-button'
import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '../blog-posts'
import Link from 'next/link'

async function BlogPostPage({ params }: { params: Promise<{ domain?: string; slug?: string }> }) {
  const { domain, slug } = await params
  const post = getBlogPostBySlug(slug || '')

  if (!post) {
    notFound()
  }

  const postUrl = `/sites/${domain}/blog/${post.slug}`
  const fallbackImage = '/images/blog-llm.png'
  const dateObj = new Date(post.date.split('-').join('/'))
  const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`

  return (
    <div className='container mx-auto max-w-4xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href={`/sites/${domain}/blog`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <Badge variant='blog' className='mb-4'>
          {post.category}
        </Badge>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>{post.title}</h1>
        <p className='text-muted-foreground text-xl'>{post.description}</p>
        <div className='mt-4 flex flex-row items-center justify-between gap-2'>
          <div className='text-muted-foreground text-sm'>{formattedDate}</div>
          <ShareButtons title={post.title} url={postUrl} hideLabel={true} />
        </div>
      </div>

      <div className='relative mb-8 h-[400px] w-full overflow-hidden rounded-lg'>
        <Image src={post.image || fallbackImage} alt={post.title} fill className='object-cover' priority />
      </div>

      <BlogContent />

      {/* Related domain blog posts */}
    </div>
  )
}

export default withSitesNavbar(BlogPostPage)
