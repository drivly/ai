import { ai } from '@/ai.config'
import type { BlogPost } from '@/components/sites/blog-ui/blog-posts'
import { titleToSlug } from '@/lib/utils/slug'
import { getAllBlogPosts } from '@/app/(sites)/sites/[domain]/blog/blog-posts'

const categories = [
  'AI Functions',
  'Language Models',
  'Industry Insights',
  'Best Practices',
  'Ethics',
  'Tutorials',
  'Machine Learning',
  'Developer Tools',
  'Case Studies',
]

const imagePaths = [
  '/images/blog-functions.png',
  '/images/blog-llm.png',
  '/images/apis-plus-ai.png',
  '/placeholder.svg?height=200&width=400',
]

/**
 * Generate a list of blog posts with AI-generated titles
 */
export async function generateBlogPosts(domain: string, count: number = 9, topics?: string): Promise<BlogPost[]> {
  console.log(`Generating blog posts for domain: ${domain}`)
  
  const isPreview = typeof window === 'undefined' && process.env.VERCEL_ENV === 'preview'
  console.log(`Environment: ${isPreview ? 'Preview' : 'Production/Development'}`)
  
  let domainTopics = topics
  if (!domainTopics) {
    if (domain === 'workflows.do') {
      domainTopics = 'workflow automation, business process optimization, task management, workflow efficiency'
    } else if (domain === 'functions.do') {
      domainTopics = 'serverless functions, function programming, AI functions, code execution'
    } else if (domain === 'agents.do') {
      domainTopics = 'AI agents, autonomous systems, agent frameworks, intelligent assistants'
    } else {
      domainTopics = `${domain.replace('.do', '')} related topics`
    }
  }
  
  console.log(`Using topics: ${domainTopics}`)
  
  try {
    const settings = isPreview ? { _bypassCache: true } : undefined
    
    const titles = await ai.listBlogPostTitles({
      domain,
      count,
      topics: domainTopics,
    }, settings)

    console.log(`Generated ${titles.length} titles for domain ${domain}`)

    const today = new Date()
    const dateString = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`

    return titles.map((title: string, index: number) => {
      return {
        slug: titleToSlug(title),
        title: title,
        description: `AI-generated blog post about ${title.toLowerCase()} for ${domain}`,
        date: dateString,
        category: categories[index % categories.length],
        image: imagePaths[index % imagePaths.length],
      }
    })
  } catch (error) {
    console.error(`Error generating blog posts for domain ${domain}:`, error)
    const staticPosts = getAllBlogPosts()
    return staticPosts.map(post => ({
      ...post,
      description: `${post.description} Relevant for ${domain}.`
    }))
  }
}

/**
 * Get the content for a specific blog post by title
 */
export async function getBlogPostContent(title: string, domain: string): Promise<string> {
  console.log(`Generating blog post content for title: "${title}" in domain: ${domain}`)
  
  const isPreview = typeof window === 'undefined' && process.env.VERCEL_ENV === 'preview'
  
  try {
    let tone = 'professional'
    let length = 'medium'
    
    if (domain === 'workflows.do') {
      tone = 'practical'
      length = 'medium'
    } else if (domain === 'functions.do') {
      tone = 'technical'
      length = 'medium'
    } else if (domain === 'agents.do') {
      tone = 'conversational'
      length = 'medium'
    } else if (domain.includes('functions')) {
      tone = 'technical'
    } else if (domain.includes('workflows')) {
      tone = 'practical'
    } else if (domain.includes('agents')) {
      tone = 'conversational'
    }
    
    console.log(`Using tone: ${tone} and length: ${length} for domain: ${domain}`)
    
    const settings = isPreview ? { _bypassCache: true } : undefined
    
    const content = await ai.writeBlogPost({
      title,
      domain,
      tone,
      length,
    }, settings)
    
    console.log(`Successfully generated content for "${title}" in domain ${domain}`)
    return content
  } catch (error) {
    console.error(`Error generating blog post content for "${title}" in domain ${domain}:`, error)
    return `### ${title}\n\nThis is a blog post about ${title} for ${domain}.\n\nWe're currently experiencing issues with our content generation system. Please check back later for the full article.`
  }
}
