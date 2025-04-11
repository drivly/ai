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
    let additionalContext = ''
    
    if (domain === 'workflows.do') {
      tone = 'practical'
      length = 'medium'
      additionalContext = 'Focus on workflow automation, business process optimization, and practical examples.'
    } else if (domain === 'functions.do') {
      tone = 'technical'
      length = 'medium'
      additionalContext = 'Include code examples and technical implementation details where appropriate.'
    } else if (domain === 'agents.do') {
      tone = 'conversational'
      length = 'medium'
      additionalContext = 'Discuss AI agent capabilities, autonomous systems, and real-world applications.'
    } else if (domain.includes('functions')) {
      tone = 'technical'
      additionalContext = 'Include code examples and technical implementation details where appropriate.'
    } else if (domain.includes('workflows')) {
      tone = 'practical'
      additionalContext = 'Focus on workflow automation, business process optimization, and practical examples.'
    } else if (domain.includes('agents')) {
      tone = 'conversational'
      additionalContext = 'Discuss AI agent capabilities, autonomous systems, and real-world applications.'
    }
    
    console.log(`Using tone: ${tone}, length: ${length}, and additional context for domain: ${domain}`)
    
    const settings = isPreview ? 
      { _bypassCache: true, _temperature: 0.8 } : 
      { _temperature: 0.7, _cacheKey: `blog_${domain}_${title.substring(0, 20)}` }
    
    let attempts = 0
    const maxAttempts = 2
    let content = ''
    
    while (attempts < maxAttempts) {
      try {
        attempts++
        console.log(`Attempt ${attempts} to generate content for "${title}" in domain ${domain}`)
        
        content = await ai.writeBlogPost({
          title,
          domain,
          tone,
          length,
          context: additionalContext,
        }, settings)
        
        if (content && content.length > 100) {
          console.log(`Successfully generated content for "${title}" in domain ${domain}`)
          return content
        } else {
          console.warn(`Generated content for "${title}" was too short (${content.length} chars), retrying...`)
        }
      } catch (retryError) {
        console.error(`Error in attempt ${attempts} for "${title}":`, retryError)
        if (attempts >= maxAttempts) throw retryError
      }
    }
    
    if (content) return content
    
    throw new Error('Failed to generate content after multiple attempts')
  } catch (error) {
    console.error(`Error generating blog post content for "${title}" in domain ${domain}:`, error)
    
    let fallbackContent = `# ${title}\n\n`
    
    if (domain === 'workflows.do') {
      fallbackContent += `This article explores how workflow automation can streamline business processes and improve efficiency. Workflows.do provides tools for reliably executing business processes with minimal complexity.\n\n`
    } else if (domain === 'functions.do') {
      fallbackContent += `This article examines how Functions.do makes generative AI feel like classic programming again, providing typesafe results without complexity.\n\n`
    } else if (domain === 'agents.do') {
      fallbackContent += `This article discusses autonomous digital workers and how they can be deployed and managed using Agents.do to perform complex tasks.\n\n`
    } else {
      fallbackContent += `This article explores key concepts related to ${domain} and how they can be applied in practical scenarios.\n\n`
    }
    
    fallbackContent += `We're currently experiencing issues with our content generation system. Please check back later for the full article.`
    
    return fallbackContent
  }
}
