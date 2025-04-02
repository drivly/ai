import { BlogPosts } from '@/components/sites/blog-ui/blog-posts'
import Particles from '@/components/sites/magicui/particles'
import { Navbar } from '@/components/sites/navbar'
import DotdoSection from '@/components/sites/sections/dotdo'
import HeroSection from '@/components/sites/sections/hero'
import { domainsConfig, getGlowColor } from '@/domains.config'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { getAllBlogPosts, getAllCategories } from './blog-posts'

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

  if (site && !domainsConfig.domains[site]) {
    return notFound()
  }

  if (isBlog) {
    return <BlogPage domain={domains[0]} />
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
