import { getPayload } from 'payload'
import config from '../payload.config'
import { waitUntil } from '@vercel/functions'

export interface BlogPost {
  title: string
  slug: string
  description?: string
  content?: string
  domain: string
}

function generateMockBlogPosts(domain: string): BlogPost[] {
  const topics = [
    'Getting Started',
    'Advanced Features',
    'API Integration',
    'Best Practices',
    'Case Studies',
    'Performance Tips',
    'Security Guidelines',
    'Community Contributions',
    'Future Roadmap',
    'Frequently Asked Questions'
  ]
  
  return topics.map((topic, index) => {
    const slug = topic.toLowerCase().replace(/\s+/g, '-')
    return {
      title: `${topic} with ${domain}`,
      slug,
      description: `Learn about ${topic.toLowerCase()} when working with ${domain}.`,
      domain
    }
  })
}

function generateMockBlogPost(domain: string, slug: string): BlogPost {
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  
  return {
    title: `${title} with ${domain}`,
    slug,
    content: `<h1>${title} with ${domain}</h1>
<p>This is a placeholder blog post about ${title.toLowerCase()} with ${domain}.</p>
<p>The actual content will be generated using AI functions when the system is fully configured.</p>
<h2>Key Points</h2>
<ul>
  <li>Point 1 about ${domain}</li>
  <li>Point 2 about ${title.toLowerCase()}</li>
  <li>Point 3 about integration</li>
</ul>
<p>For more information, please check the documentation.</p>`,
    domain
  }
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
    
    let generatedPosts: BlogPost[] = []
    
    try {
      const { executeFunction } = await import('../tasks/executeFunction')
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
      
      generatedPosts = result.output?.items || []
    } catch (functionError) {
      console.log('AI function failed, using mock data:', functionError)
      generatedPosts = generateMockBlogPosts(domain)
    }
    
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
    return generateMockBlogPosts(domain)
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
    
    let blogPost: BlogPost
    
    try {
      const { executeFunction } = await import('../tasks/executeFunction')
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
      
      blogPost = {
        title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        slug,
        content,
        domain
      }
    } catch (functionError) {
      console.log('AI function failed, using mock data:', functionError)
      blogPost = generateMockBlogPost(domain, slug)
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
    return generateMockBlogPost(domain, slug)
  }
}
