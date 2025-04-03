import { Badge } from '@/components/sites/badge'
import { BlogContent } from '@/components/sites/blog-ui/blog-content'
import { BlogPosts } from '@/components/sites/blog-ui/blog-posts'
import { ShareButtons } from '@/components/sites/blog-ui/share-button'
import Particles from '@/components/sites/magicui/particles'
import DotdoSection from '@/components/sites/sections/dotdo'
import HeroSection from '@/components/sites/sections/hero'
import { domainsConfig, getGlowColor } from '@/domains.config'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllBlogPosts, getAllCategories, getBlogPostBySlug } from './blog/blog-posts'
import { withDomainWrapper } from './with-domain-wrapper'

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function HomePage({ params }: { params: Promise<{ domain?: string }> }) {
  const { domain } = await params

  const site = domain ?? 'llm.do'
  const isBlog = domain === 'blog'
  const isBlogPost = isBlog && domain

  if (site && !domainsConfig.domains[site]) {
    return notFound()
  }

  if (isBlogPost) {
    return <BlogPostPage domain={domain} slug={domain} />
  }

  if (isBlog) {
    return <BlogPage domain={domain} />
  }

  const glowColor = getGlowColor(site)

  return (
    <>
      <div className='hero-glow-container' style={{ '--glow-color': glowColor } as React.CSSProperties}>
        <HeroSection />
      </div>
      <DotdoSection />
      <Particles className='absolute inset-0 -z-10' quantity={50} ease={70} size={0.05} staticity={40} color={'#ffffff'} />
    </>
  )
}

export default withDomainWrapper(HomePage)
// Get Started // Join
// --- Request access
// email onboarding with questions react-email // templates
// from Bryant's email - simple email template domain specific
//
//
// login with Github

async function BlogPage({ domain }: { domain: string }) {
  // Move data fetching to the server component
  const posts = getAllBlogPosts()
  const categories = getAllCategories()

  return (
    <div className='container mx-auto px-4 pt-20 pb-12 md:pt-24 md:pb-24 lg:pb-32'>
      <div className='mb-8'>
        <Link href={`/sites/${domain}`} className='hover:text-primary mb-4 inline-flex items-center text-sm text-gray-500 transition-colors'>
          <ArrowLeft className='mr-1 h-4 w-4' />
          Back
        </Link>
        <h1 className='mb-8 text-4xl font-bold tracking-tight'>Blog</h1>
      </div>

      <BlogPosts initialPosts={posts} categories={categories} />
    </div>
  )
}

async function BlogPostPage({ domain, slug }: { domain: string; slug: string }) {
  const post = getBlogPostBySlug(slug)

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
