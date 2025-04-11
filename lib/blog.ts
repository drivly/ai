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
  let domainContext = ''
  
  if (!domainTopics) {
    if (domain === 'workflows.do') {
      domainTopics = 'workflow automation, business process optimization, task management, workflow efficiency, business workflows'
      domainContext = 'Focus on practical business workflow automation examples and best practices for workflows.do'
    } else if (domain === 'functions.do') {
      domainTopics = 'serverless functions, function programming, AI functions, code execution, function composition'
      domainContext = 'Focus on technical implementation of functions and serverless architecture'
    } else if (domain === 'agents.do') {
      domainTopics = 'AI agents, autonomous systems, agent frameworks, intelligent assistants, agent orchestration'
      domainContext = 'Focus on agent capabilities, use cases, and implementation strategies'
    } else if (domain.includes('functions')) {
      domainTopics = 'serverless functions, function programming, AI functions, code execution'
      domainContext = 'Focus on technical implementation of functions'
    } else if (domain.includes('workflows')) {
      domainTopics = 'workflow automation, business process optimization, task management'
      domainContext = 'Focus on practical business workflow automation'
    } else if (domain.includes('agents')) {
      domainTopics = 'AI agents, autonomous systems, agent frameworks, intelligent assistants'
      domainContext = 'Focus on agent capabilities and use cases'
    } else {
      domainTopics = `${domain.replace('.do', '')} related topics`
      domainContext = `Focus on ${domain.replace('.do', '')} specific use cases and applications`
    }
  }
  
  console.log(`Using topics: ${domainTopics} with context: ${domainContext}`)
  
  try {
    const settings = isPreview ? 
      { _bypassCache: true, _temperature: 0.7 } : 
      { _temperature: 0.7, _cacheKey: `blog_titles_${domain}` }
    
    let attempts = 0
    const maxAttempts = 2
    let titles: string[] = []
    
    while (attempts < maxAttempts && (!titles || titles.length === 0)) {
      try {
        attempts++
        console.log(`Attempt ${attempts} to generate titles for domain ${domain}`)
        
        titles = await ai.listBlogPostTitles({
          domain,
          count,
          topics: domainTopics,
          context: domainContext
        }, settings)
        
        if (titles && titles.length > 0) {
          console.log(`Successfully generated ${titles.length} titles for domain ${domain}`)
        } else {
          console.warn(`Generated empty titles array for ${domain}, retrying...`)
        }
      } catch (retryError) {
        console.error(`Error in attempt ${attempts} for domain ${domain}:`, retryError)
        if (attempts >= maxAttempts) throw retryError
      }
    }
    
    if (!titles || titles.length === 0) {
      throw new Error('Failed to generate titles after multiple attempts')
    }

    const today = new Date()
    const dateString = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`

    return titles.map((title: string, index: number) => {
      let description = `AI-generated blog post about ${title.toLowerCase()} for ${domain}`
      
      if (domain === 'workflows.do') {
        description = `Learn how ${title.toLowerCase()} can improve your business workflow efficiency and automation.`
      } else if (domain === 'functions.do') {
        description = `Explore ${title.toLowerCase()} in the context of serverless functions and AI-powered code execution.`
      } else if (domain === 'agents.do') {
        description = `Discover how ${title.toLowerCase()} relates to AI agents and autonomous systems.`
      }
      
      return {
        slug: titleToSlug(title),
        title: title,
        description: description,
        date: dateString,
        category: categories[index % categories.length],
        image: imagePaths[index % imagePaths.length],
      }
    })
  } catch (error) {
    console.error(`Error generating blog posts for domain ${domain}:`, error)
    
    if (domain === 'workflows.do') {
      const workflowPosts = [
        {
          slug: 'workflow-automation-best-practices',
          title: 'Workflow Automation Best Practices for Business Efficiency',
          description: 'Learn how to implement effective workflow automation strategies to streamline your business processes.',
          date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-'),
          category: 'Best Practices',
          image: '/images/blog-functions.png',
        },
        {
          slug: 'optimizing-business-processes',
          title: 'Optimizing Business Processes with Workflows.do',
          description: 'Discover how Workflows.do can help you optimize and automate complex business processes with minimal effort.',
          date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-'),
          category: 'Tutorials',
          image: '/images/blog-llm.png',
        },
        {
          slug: 'workflow-integration-strategies',
          title: 'Workflow Integration Strategies for Enterprise Systems',
          description: 'Explore effective strategies for integrating automated workflows with your existing enterprise systems.',
          date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-'),
          category: 'Industry Insights',
          image: '/images/apis-plus-ai.png',
        }
      ]
      
      const staticPosts = getAllBlogPosts()
      const remainingCount = count - workflowPosts.length
      
      if (remainingCount > 0) {
        const additionalPosts = staticPosts.slice(0, remainingCount).map(post => ({
          ...post,
          description: `${post.description} Learn how this applies to workflow automation and business processes.`
        }))
        
        return [...workflowPosts, ...additionalPosts]
      }
      
      return workflowPosts
    }
    
    const staticPosts = getAllBlogPosts()
    return staticPosts.map(post => {
      let domainDescription = post.description
      
      if (domain === 'functions.do') {
        domainDescription = `${post.description} Explore how this works with serverless functions and code execution.`
      } else if (domain === 'agents.do') {
        domainDescription = `${post.description} Discover the implications for AI agents and autonomous systems.`
      } else {
        domainDescription = `${post.description} Relevant for ${domain}.`
      }
      
      return {
        ...post,
        description: domainDescription
      }
    })
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
