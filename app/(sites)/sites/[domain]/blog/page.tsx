import { BlogPosts } from '@/components/sites/blog-ui/blog-posts'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllBlogPosts } from './blog-posts'
import { BLOG_CATEGORIES } from './constants'

async function BlogPage(props: { params: { domain: string } }) {
  const { domain } = props.params

  // Move data fetching to the server component
  const posts = await getAllBlogPosts(domain) // { title, description, category }
  // const categories = await getAllCategories(domain)

  return (
    <div className='container mx-auto max-w-6xl px-3 py-24 md:py-32 xl:px-0'>
      <div className='mb-8'>
        <Link href='/' className='hover:text-primary mb-4 inline-flex items-center text-sm text-gray-500 transition-colors'>
          <ArrowLeft className='mr-1 h-4 w-4' />
          Back
        </Link>
        <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text text-4xl leading-tight font-medium tracking-tight text-balance text-transparent dark:from-white dark:to-white/40'>
          Blog
        </h1>
      </div>

      <BlogPosts initialPosts={posts} categories={BLOG_CATEGORIES} />
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: BlogPage })
// Get Started // Join
// --- Request access
// email onboarding with questions react-email // templates
// from Bryant's email - simple email template domain specific
//
//
// login with Github
