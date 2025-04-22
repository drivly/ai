import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain'
import { listBlogPostTitles, siteContent, writeBlogPost } from '@/.ai/functions/content'
import { waitUntil } from '@vercel/functions'
import { cache } from 'react'
import { slugify } from '@/lib/slugify'



export const getData = cache(async ({ domain }: { domain: string }) => {
  const [posts, content] = await Promise.all([listBlogPostTitles({ domain }), siteContent({ domain }, { system: 'You are an expert at writing compelling and SEO-optimized landing page content', temperature: 1 })])
  waitUntil(listBlogPostTitles({ domain }).then(posts => posts.map(post => writeBlogPost({ domain, slug: slugify(post.title) }))))
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

export default async function ProjectLandingPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params
    // const project = await fetchProjectByDomain(domain)

    const data = await getData({ domain })

    return (
      <div >
        <kbd>{data.badge}</kbd>
        <h1>{data.hero.headline}</h1>
        <p>{data.hero.subheadline}</p>

        <article>
          <h2>FAQs</h2>
          {data.faqs.map((item) => (
            <>
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
              <br/>
            </>
          ))}
        </article>
        <Link href="/blog">Blog</Link>
      </div>
    )
}
