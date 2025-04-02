import { domainsConfig, domains } from '@/domains.config'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogPosts } from '../../../_components/blog-ui/blog-posts'
import { getAllBlogPosts, getAllCategories } from '../../blog-posts'

export default async function BlogIndexPage(props: { params: { domains: string } }) {
  const { params } = props
  const { domains: domainParam } = params
  
  if (!domainParam || !domains.includes(domainParam)) {
    return notFound()
  }
  
  const posts = getAllBlogPosts()
  const categories = getAllCategories()

  return (
    <div className='container mx-auto px-4 pt-20 pb-12 md:pt-24 md:pb-24 lg:pb-32'>
      <div className='mb-8'>
        <Link href={`/sites/${domainParam}`} className='hover:text-primary mb-4 inline-flex items-center text-sm text-gray-500 transition-colors'>
          <ArrowLeft className='mr-1 h-4 w-4' />
          Back
        </Link>
        <h1 className='mb-8 text-4xl font-bold tracking-tight'>Blog</h1>
      </div>

      <BlogPosts initialPosts={posts} categories={categories} />
    </div>
  )
}
