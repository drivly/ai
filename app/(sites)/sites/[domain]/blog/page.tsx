import { BlogPosts } from '@/components/sites/blog-ui/blog-posts'
import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllBlogPosts, getAllCategories } from './blog-posts'

async function BlogPage(props: { params: Promise<{ domain?: string }> }) {
  const { domain } = await props.params
  // Move data fetching to the server component
  const posts = getAllBlogPosts()
  const categories = getAllCategories()

  return (
    <div className='container mx-auto max-w-7xl px-4 pt-20 pb-12 md:pt-24 md:pb-24 lg:pb-32'>
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

export default withSitesNavbar(BlogPage)
// Get Started // Join
// --- Request access
// email onboarding with questions react-email // templates
// from Bryant's email - simple email template domain specific
//
//
// login with Github
