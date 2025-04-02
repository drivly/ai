import { domainsConfig, getGlowColor } from '@/domains.config'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { Badge } from '../../_components/badge'
import { BlogContent } from '../../_components/blog-ui/blog-content'
import { BlogPosts } from '../../_components/blog-ui/blog-posts'
import { ShareButtons } from '../../_components/blog-ui/share-button'
import Particles from '../../_components/magicui/particles'
import { Navbar } from '../../_components/navbar'
import DotdoSection from '../../_components/sections/dotdo'
import HeroSection from '../../_components/sections/hero'
import { getAllBlogPosts, getAllCategories, getBlogPostBySlug } from '../blog-posts'

type PagePromiseParams<T extends object> = {
  params: Promise<T>
}

type DomainPageProps = PagePromiseParams<{ domains?: string[] }>

const withDomainContainer = <TPage extends DomainPageProps>(WrappedPage: React.ComponentType<TPage>) => {
  return async (props: TPage) => (
    <Fragment>
      <Navbar {...props} />
      <main className='flex-1'>
        <WrappedPage {...props} />
      </main>
    </Fragment>
  )
}

// need to be able to render the specific website from the slug and throw not found if the slug is not found
async function HomePage({ params }: { params: Promise<{ domains?: string[] }> }) {
  const { domains } = await params

  const site = domains?.[0] ?? 'llm.do'
  const isBlog = domains?.[1] === 'blog'
  const isBlogPost = isBlog && domains?.[2]
  const isPrivacy = domains?.[1] === 'privacy'
  const isTerms = domains?.[1] === 'terms'
  const isPricing = domains?.[1] === 'pricing'

  if (site && !domainsConfig.domains[site]) {
    return notFound()
  }

  if (isBlogPost) {
    return <BlogPostPage domain={domains[0]} slug={domains[2]} />
  }

  if (isBlog) {
    return <BlogPage domain={domains[0]} />
  }
  
  if (isPrivacy) {
    return <PrivacyPage domain={domains[0]} />
  }
  
  if (isTerms) {
    return <TermsPage domain={domains[0]} />
  }
  
  if (isPricing) {
    return <PricingPage domain={domains[0]} />
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

export default withDomainContainer(HomePage)
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

async function BlogPostPage({ domain, slug }: { domain: string, slug: string }) {
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

async function PrivacyPage({ domain }: { domain: string }) {
  return (
    <div className='container mx-auto max-w-4xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href={`/sites/${domain}`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Privacy Policy</h1>
        <div className='prose mt-8 max-w-none dark:prose-invert'>
          <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit {domain}.</p>
          <h2>Personal Information We Collect</h2>
          <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
          <h2>How We Use Your Personal Information</h2>
          <p>We use the information that we collect to help us screen for potential risk and fraud, and more generally to improve and optimize our Site.</p>
        </div>
      </div>
    </div>
  )
}

async function TermsPage({ domain }: { domain: string }) {
  return (
    <div className='container mx-auto max-w-4xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href={`/sites/${domain}`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Terms of Service</h1>
        <div className='prose mt-8 max-w-none dark:prose-invert'>
          <p>These Terms of Service govern your use of the website located at {domain} and any related services provided by us.</p>
          <h2>Limitations</h2>
          <p>You agree that we will not be liable to you or any third party for any loss or damages of any kind.</p>
          <h2>Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws applicable to agreements made and to be performed in the United States.</p>
        </div>
      </div>
    </div>
  )
}

async function PricingPage({ domain }: { domain: string }) {
  return (
    <div className='container mx-auto max-w-4xl px-4 pt-24 pb-12 md:pt-32'>
      <Link href={`/sites/${domain}`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>

      <div className='mb-8'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight'>Pricing</h1>
        <div className='prose mt-8 max-w-none dark:prose-invert'>
          <p>Choose the plan that's right for your needs.</p>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-lg border p-6'>
              <h3 className='text-xl font-bold'>Free</h3>
              <div className='mt-2 text-3xl font-bold'>$0</div>
              <p className='mt-4'>Basic features for individuals</p>
            </div>
            <div className='rounded-lg border p-6 shadow-md'>
              <h3 className='text-xl font-bold'>Pro</h3>
              <div className='mt-2 text-3xl font-bold'>$49</div>
              <p className='mt-4'>Advanced features for power users</p>
            </div>
            <div className='rounded-lg border p-6'>
              <h3 className='text-xl font-bold'>Enterprise</h3>
              <div className='mt-2 text-3xl font-bold'>Contact us</div>
              <p className='mt-4'>Custom solutions for teams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
