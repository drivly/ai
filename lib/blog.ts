import { getPayload } from 'payload'
import config from '../payload.config'
import { executeFunction } from '../tasks/executeFunction'
import { waitUntil } from '@vercel/functions'

export interface BlogPost {
  title: string
  slug: string
  description?: string
  content?: string
  domain: string
}

export async function getBlogPosts(domain: string): Promise<BlogPost[]> {
  try {
    const payload = await getPayload({ config })
    
    const { docs: existingBlogPosts } = await payload.find({
      collection: 'resources',
      where: {
        type: {
          equals: 'blog-post-list'
        },
        name: {
          equals: `blog-posts-${domain}`
        }
      },
      depth: 0,
    })
    
    if (existingBlogPosts.length > 0 && existingBlogPosts[0].data && typeof existingBlogPosts[0].data === 'object' && 'posts' in existingBlogPosts[0].data) {
      return existingBlogPosts[0].data.posts as BlogPost[]
    }
    
    console.log(`Generating blog posts for ${domain}...`)
    const result = await executeFunction({
      input: {
        functionName: 'listBlogPostTitles',
        args: {
          domain,
          count: 10
        },
        type: 'ObjectArray'
      },
      payload
    })
    
    const generatedPosts = result.output?.items || []
    
    waitUntil(
      payload.create({
        collection: 'resources',
        data: {
          name: `blog-posts-${domain}`,
          type: 'blog-post-list',
          data: {
            domain,
            posts: generatedPosts
          }
        }
      })
    )
    
    return generatedPosts
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return []
  }
}

export async function getBlogPost(domain: string, slug: string): Promise<BlogPost | null> {
  try {
    const payload = await getPayload({ config })
    
    const { docs: existingBlogPosts } = await payload.find({
      collection: 'resources',
      where: {
        type: {
          equals: 'blog-post'
        },
        name: {
          equals: `blog-post-${domain}-${slug}`
        }
      },
      depth: 0,
    })
    
    if (existingBlogPosts.length > 0 && existingBlogPosts[0].data) {
      return existingBlogPosts[0].data as unknown as BlogPost
    }
    
    console.log(`Generating blog post for ${domain}/${slug}...`)
    const result = await executeFunction({
      input: {
        functionName: 'writeBlogPost',
        args: {
          domain,
          slug,
          title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        },
        type: 'Markdown'
      },
      payload
    })
    
    const content = result.output?.text || ''
    
    const blogPost = {
      title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug,
      content,
      domain
    }
    
    waitUntil(
      payload.create({
        collection: 'resources',
        data: {
          name: `blog-post-${domain}-${slug}`,
          type: 'blog-post',
          data: blogPost
        }
      })
    )
    
    return blogPost
  } catch (error) {
    console.error('Error getting blog post:', error)
    return null
  }
}
