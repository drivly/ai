import { BlogPosts } from '@/components/sites/blog-ui/blog-posts'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllBlogPosts, getAllCategories } from './blog-posts'

async function BlogPage(props: { params: { domain: string }; searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { domain } = props.params
  const searchParams = props.searchParams
  // Move data fetching to the server component
  const posts = await getAllBlogPosts(domain)
  const categories = await getAllCategories(domain)

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
}

export default withSitesWrapper({ WrappedPage: BlogPage, withFaqs: false })
// Get Started // Join
// --- Request access
// email onboarding with questions react-email // templates
// from Bryant's email - simple email template domain specific
//
//
// login with Github
