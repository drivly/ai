import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cache } from 'react'
import { listBlogPostTitles, siteContent } from '@/.ai/functions/content'
import slugify from 'slugify'


export const getData = cache(async ({ domain }: { domain: string }) => {
  const [posts, content] = await Promise.all([listBlogPostTitles({ domain }), siteContent({ domain }, { system: 'You are an expert at writing compelling and SEO-optimized landing page content', temperature: 1 })])
  return { posts, ...content }
})

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params || {}
  const data = await getData({ domain })

  return {
    title: data.seo.title,
    description: data.seo.description,
  }
}

export default async function BlogPage({ params }: { params: Promise<{ domain: string }> }) {
  try {
    const { domain } = await params || {}
    // const project = await fetchProjectByDomain(domain)
    const data = await getData({ domain })

    const categories = Array.from(new Set(data.posts.map((post) => post.category)))

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

        <div >
          {data.posts.map((post) => (
            <article key={post.title}>
              <Link prefetch={true} href={'/blog/' + slugify(post.title)}>
                <h3 className='text-2xl font-bold'>{post.title}</h3>
                <p className='text-gray-500'>{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in BlogPage:', error)
    return <div>Error loading blog posts</div>
  }
}
